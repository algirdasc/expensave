import {EnvironmentInterface} from './environment.interface';

export const environment: EnvironmentInterface = {
    production: true,
    apiUrl: process.env.API_URL,
    currencyCode: process.env.CURRENCY_CODE || 'EUR',
    locale: process.env.LOCALE || 'en',
};
