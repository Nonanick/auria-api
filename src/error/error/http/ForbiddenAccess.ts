import { HTTPError } from './HTTPError';

export class ForbiddenAccess extends Error implements HTTPError {
  get httpCode() {
    return 403;
  }
}