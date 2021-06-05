import { HTTPError } from './http_error.error';

export class InternalServerError extends Error implements HTTPError {
  get httpCode() {
    return 500;
  }
}