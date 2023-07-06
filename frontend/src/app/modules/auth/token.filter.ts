import {HttpRequest} from '@angular/common/http';
import {APP_CONFIG} from '../../app.initializer';

export const tokenFilter = (req: HttpRequest<any>) => {
  const publicUrls = [
    '/assets/config.json',
    '/auth/login',
    '/auth/refresh-token',
  ];

  const path = req.urlWithParams.replace(APP_CONFIG.apiUrl, '');

  return publicUrls.includes(path);
};
