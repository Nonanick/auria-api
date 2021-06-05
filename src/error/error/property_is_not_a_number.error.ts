import { ApiError } from '../api_error.error';

export class PropertyIsNotANumber extends ApiError {
  get httpStatus(): number {
    return 400;
  }

}