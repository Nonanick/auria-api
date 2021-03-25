import { HTTPError } from './HTTPError';

export class UnauthorizedAccess extends Error implements HTTPError {
  get httpCode() {
    return 401;
  }
}