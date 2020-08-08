import { ApiError } from '../ApiError';

export class ParameterSchemaViolation extends ApiError {

  get httpStatus(): number {
    return 400; // Bad Request
  }

}