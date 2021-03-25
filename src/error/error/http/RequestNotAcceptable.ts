import { HTTPError } from './HTTPError';

export class RequestNotAcceptable extends Error implements HTTPError {
  get httpCode() {
    return 406;
  }
}