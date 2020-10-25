import { ApiError } from '../ApiError';

export class PropertyValidationFailed extends ApiError {

  get httpStatus(): number {
    return 400; // Bad request
  }

}