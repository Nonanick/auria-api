import { HTTPError } from './http_error.error';

export class ExpectationFailed extends Error implements HTTPError {
  get httpCode() {
    return 417;
  }
}