import { ApiError } from '../api_error.error';

export class NumberOutOfAllowedRange extends ApiError {
  get httpStatus(): number {
    return 400;
  }

}