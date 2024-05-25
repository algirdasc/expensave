import pkg from '../../package.json';
import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
    production: true,
    configFile: 'config.json',
    version: pkg.version,
};
