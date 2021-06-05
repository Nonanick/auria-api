import { HTTPError } from './http_error.error';

export class RequestNotAcceptable extends Error implements HTTPError {
  get httpCode() {
    return 406;
  }
}