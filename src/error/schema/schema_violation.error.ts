import { ErrorObject } from "ajv";
import { ApiError } from "../api_error.error";

export class SchemaViolation extends ApiError {
  get httpStatus(): number {
    return 400;
  }

  constructor(errors?: ErrorObject[]) {
    super(stringfyError(errors));
  }

}

function stringfyError(errors?: ErrorObject[]) {
  if (errors == null || errors?.length === 0) {
    return 'Schema violation! Request failed';
  }
  let accumulate: string[] = [];
  errors.forEach(err => {
    accumulate.push(
      `Invalid request schema! ${err.message} @ body${err.instancePath != '' ? ' -> ' + err.instancePath : ''} `
    );
  });
  return accumulate.join(', ');
}