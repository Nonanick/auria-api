import { ApiError } from '../api_error.error';

export class ProcedureExecutionFailed extends ApiError {

  get httpStatus(): number {
    return 400;
  }

}