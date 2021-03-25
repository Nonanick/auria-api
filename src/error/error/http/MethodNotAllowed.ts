import { HTTPError } from './HTTPError';

export class MethodNotAllowed extends Error implements HTTPError {
  get httpCode() {
    return 405;
  }
}