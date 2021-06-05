import { HTTPError } from './http_error.error';

export class MethodNotAllowed extends Error implements HTTPError {
  get httpCode() {
    return 405;
  }
}