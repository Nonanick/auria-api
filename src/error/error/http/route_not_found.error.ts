import { HTTPError } from './http_error.error';

export class RouteNotFound extends Error implements HTTPError {
  get httpCode() {
    return 404;
  }
}