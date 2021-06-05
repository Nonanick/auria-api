import { HTTPError } from './http_error.error';

export class RequestTimeout extends Error implements HTTPError {
  get httpCode() {
    return 408;
  }
}