import { ApiError } from '../ApiError';

export class ParameterValidationFailed extends ApiError {

  get httpStatus(): number {
    return 400; // Bad request
  }

}