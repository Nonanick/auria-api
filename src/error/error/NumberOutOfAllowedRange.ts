import { ApiError } from '../ApiError';

export class NumberOutOfAllowedRange extends ApiError {
  get httpStatus(): number {
    return 400;
  }

}