import { HTTPError } from './HTTPError';

export class BadRequest extends Error implements HTTPError {
  get httpCode() {
    return 400;
  }
}