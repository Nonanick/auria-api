import { ApiError } from '../ApiError';

export class PropertyIsNotANumber extends ApiError {
  get httpStatus(): number {
    return 400;
  }

}