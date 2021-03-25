import { HTTPError } from './HTTPError';

export class RouteNotFound extends Error implements HTTPError {
  get httpCode() {
    return 404;
  }
}