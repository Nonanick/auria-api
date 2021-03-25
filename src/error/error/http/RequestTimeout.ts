import { HTTPError } from './HTTPError';

export class RequestTimeout extends Error implements HTTPError {
  get httpCode() {
    return 408;
  }
}