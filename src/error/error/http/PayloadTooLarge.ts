import { HTTPError } from './HTTPError';

export class PayloadTooLarge extends Error implements HTTPError {
  get httpCode() {
    return 403;
  }
}