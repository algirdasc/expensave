import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { APP_CONFIG } from '../app.initializer';

@Pipe({
    name: 'shortNumber',
})
export class ShortNumberPipe implements PipeTransform {
    public transform(input: number | string, ...args: string[]): string {
        if (typeof input === 'string') {
            input = parseFloat(input);
        }

        if (isNaN(input) || input === null) {
            return '';
        }

        let abs: number = Math.abs(input);
        const rounder = Math.pow(10, 2);
        const isNegative = input < 0;
        let key = '';

        const powers = [
            { key: 'Q', value: Math.pow(10, 15), multiply: 1 },
            { key: 'T', value: Math.pow(10, 12), multiply: 1 },
            { key: 'B', value: Math.pow(10, 9), multiply: 1 },
            { key: 'M', value: Math.pow(10, 6), multiply: 1 },
            { key: 'K', value: 10000, multiply: 10 },
        ];

        for (const power of powers) {
            let reduced = abs / power.value;
            reduced = Math.round(reduced * rounder) / rounder;
            if (reduced >= 1) {
                abs = reduced * power.multiply;
                key = power.key;
                break;
            }
        }

        const num = (isNegative ? -1 : 1) * abs;

        return formatNumber(num, APP_CONFIG.locale, args[0] ?? '.2-2') + key;
    }
}
