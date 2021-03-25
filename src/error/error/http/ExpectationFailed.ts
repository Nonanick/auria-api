import { HTTPError } from './HTTPError';

export class ExpectationFailed extends Error implements HTTPError {
  get httpCode() {
    return 417;
  }
}