import { HttpRequest } from '@angular/common/http';
import { APP_CONFIG } from '../../app.initializer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokenFilter = (req: HttpRequest<any>): boolean => {
    const publicUrls = ['config.dev.json', 'config.json', '/auth/login', '/auth/refresh-token'];

    const path = req.urlWithParams.replace(APP_CONFIG.apiUrl, '');

    return publicUrls.includes(path);
};
