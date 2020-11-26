import { ApiError } from '../ApiError';

export class ProcedureExecutionFailed extends ApiError {

  get httpStatus(): number {
    return 400;
  }

}