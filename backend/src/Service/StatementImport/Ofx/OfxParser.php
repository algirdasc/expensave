<?php

declare(strict_types=1);

namespace App\Service\StatementImport\Ofx;

use InvalidArgumentException;

/**
 * Minimal OFX parser supporting both OFX 1.x (SGML, unclosed leaf tags) and
 * OFX 2.x (well-formed XML) bank statement files, including QFX variants.
 *
 * The parser is a regex tokenizer: it never evaluates DTDs, entities or
 * external references, so XXE / entity-expansion attacks are not possible.
 */
readonly class OfxParser
{
    /**
     * Hard limit to avoid pathological / DoS inputs, aligned with ISO20022 import.
     */
    private const MAX_BYTES = 5_000_000;

    /**
     * Number of leading bytes needed to reliably sniff the format (OFX 1.x
     * starts with an OFXHEADER preamble; OFX 2.x starts with an XML prolog).
     */
    private const SNIFF_BYTES = 4096;

    public function supports(string $content): bool
    {
        $head = substr($content, 0, self::SNIFF_BYTES);

        return str_contains($head, 'OFXHEADER:') || preg_match('/<OFX[\s>]/i', $head) === 1;
    }

    /**
     * Extracts bank and credit card statement transactions (<STMTTRN> blocks).
     * Investment statement entries use different tags and are ignored.
     *
     * @return list<array{trnType: ?string, datePosted: ?string, amount: ?string, fitId: ?string, name: ?string, memo: ?string}>
     */
    public function parseTransactions(string $content): array
    {
        if ($content === '' || strlen($content) > self::MAX_BYTES) {
            throw new InvalidArgumentException('OFX content is empty or exceeds the size limit.');
        }

        $root = $this->buildTree($content);

        $transactions = [];
        foreach ($root->walk() as $node) {
            if ($node->name !== 'STMTTRN') {
                continue;
            }

            $transactions[] = [
                'trnType' => $node->firstValue('TRNTYPE'),
                'datePosted' => $node->firstValue('DTPOSTED') ?? $node->firstValue('DTUSER'),
                'amount' => $node->firstValue('TRNAMT'),
                'fitId' => $node->firstValue('FITID'),
                'name' => $node->firstValue('NAME'),
                'memo' => $node->firstValue('MEMO'),
            ];
        }

        return $transactions;
    }

    /**
     * Builds a tag tree that works for both flavors:
     * - SGML: leaf tags carry text right after the tag and are never closed (<TRNAMT>-12.34)
     * - XML: leaf tags are closed (</TRNAMT>); the closing tag finds no pushed node and is ignored
     */
    private function buildTree(string $content): OfxNode
    {
        $root = new OfxNode('');
        /** @var list<OfxNode> $stack */
        $stack = [$root];

        // Tag names starting with ? or ! (XML prologs, processing instructions,
        // DOCTYPE declarations) never match the name pattern and are skipped.
        preg_match_all('/<(\/?)([A-Za-z0-9_.:-]+)\s*(\/?)>([^<]*)/s', $content, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            [, $closing, $name, $selfClosing, $text] = $match;
            $name = strtoupper($name);

            if ($closing === '/') {
                // Pop the stack up to the nearest matching open node. OFX SGML
                // containers are explicitly closed; unmatched closings are ignored.
                for ($i = count($stack) - 1; $i > 0; --$i) {
                    if ($stack[$i]->name === $name) {
                        array_splice($stack, $i);

                        break;
                    }
                }

                continue;
            }

            $text = trim($text);
            $current = $stack[count($stack) - 1];

            if ($selfClosing === '/' || $text !== '') {
                if ($text !== '') {
                    $current->addValue($name, $text);
                }

                continue;
            }

            // No text follows: container element (or an empty XML element).
            $node = new OfxNode($name);
            $current->addChild($node);
            $stack[] = $node;
        }

        return $root;
    }
}
