import { ApiError } from '../api_error.error';

export class PropertyValidationFailed extends ApiError {

  get httpStatus(): number {
    return 400; // Bad request
  }

}