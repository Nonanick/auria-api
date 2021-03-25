import { HTTPError } from './HTTPError';

export class InternalServerError extends Error implements HTTPError {
  get httpCode() {
    return 500;
  }
}