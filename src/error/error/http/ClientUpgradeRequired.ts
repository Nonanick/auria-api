import { HTTPError } from './HTTPError';

export class ClientUpgradeRequired extends Error implements HTTPError {
  get httpCode() {
    return 426;
  }
}