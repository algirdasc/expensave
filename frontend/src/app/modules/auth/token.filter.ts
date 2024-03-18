import {HttpRequest} from '@angular/common/http';
import {environment} from '../../../environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokenFilter = (req: HttpRequest<any>) => {
  const publicUrls = [
    '/auth/login',
    '/auth/refresh-token',
  ];

  const path = req.urlWithParams.replace(environment.apiUrl, '');

  return publicUrls.includes(path);
};
