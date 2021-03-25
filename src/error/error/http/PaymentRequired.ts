import { HTTPError } from './HTTPError';

export class PaymentRequired extends Error implements HTTPError {
  get httpCode() {
    return 402;
  }
}