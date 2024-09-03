<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand('app:secrets:regenerate')]
class RegenerateSecretsCommand extends Command
{
    protected function configure(): void
    {
        $this->addArgument('file', InputArgument::REQUIRED, 'env File');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $contents = file_get_contents($input->getArgument('file'));
        if ($contents === false) {
            $io->error('Could not find env file');

            return Command::FAILURE;
        }

        $contents = preg_replace_callback('/\{REGENERATE_SECRET\}/', function () {
            return $this->generateSecret();
        }, $contents);

        file_put_contents($input->getArgument('file'), $contents);

        $io->success('Secrets was regenerated');

        return Command::SUCCESS;
    }

    private function generateSecret(): string
    {
        $a = '0123456789abcdef';
        $secret = '';
        for ($i = 0; $i < 32; $i++) {
            $secret .= $a[rand(0, 15)];
        }

        return $secret;
    }
}
