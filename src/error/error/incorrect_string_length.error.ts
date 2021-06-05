import { ApiError } from '../api_error.error';

export class IncorrectStringLength extends ApiError {
  get httpStatus(): number {
    return 400;
  }

}