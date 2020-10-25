import { ApiError } from '../ApiError';

export class IncorrectStringLength extends ApiError {
  get httpStatus(): number {
    return 400;
  }

}