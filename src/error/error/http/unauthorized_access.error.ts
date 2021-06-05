import { HTTPError } from './http_error.error';

export class UnauthorizedAccess extends Error implements HTTPError {
  get httpCode() {
    return 401;
  }
}