import { HTTPError } from './http_error.error';

export class BadRequest extends Error implements HTTPError {
  get httpCode() {
    return 400;
  }
}