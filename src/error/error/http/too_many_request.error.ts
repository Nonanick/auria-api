import { HTTPError } from './http_error.error';

export class TooManyRequests extends Error implements HTTPError {
  get httpCode() {
    return 429;
  }
}