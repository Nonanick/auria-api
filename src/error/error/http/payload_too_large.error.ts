import { HTTPError } from './http_error.error';

export class PayloadTooLarge extends Error implements HTTPError {
  get httpCode() {
    return 403;
  }
}