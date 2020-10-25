import { ApiError } from '../ApiError';

export class SchemaViolation extends ApiError {

  get httpStatus(): number {
    return 400; // Bad Request
  }

}