import { HTTPError } from './http_error.error';

export class ClientUpgradeRequired extends Error implements HTTPError {
  get httpCode() {
    return 426;
  }
}