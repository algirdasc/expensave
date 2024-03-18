import {deepExtend} from '@nebular/auth';
import {environment as baseEnvironment} from './environment';

export const environment = deepExtend(baseEnvironment, {
    production: true,
    apiUrl: process.env.API_URL || 'not set',
    currencyCode: process.env.CURRENCY_CODE || 'EUR',
    locale: process.env.LOCALE || 'en',
});
