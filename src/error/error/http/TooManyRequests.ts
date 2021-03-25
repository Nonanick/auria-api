import { HTTPError } from './HTTPError';

export class TooManyRequests extends Error implements HTTPError {
  get httpCode() {
    return 429;
  }
}