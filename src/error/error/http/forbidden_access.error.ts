import { HTTPError } from './http_error.error';

export class ForbiddenAccess extends Error implements HTTPError {
  get httpCode() {
    return 403;
  }
}