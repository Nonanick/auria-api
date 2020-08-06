import { ApiErrorDescription } from './ApiErrorDescription';

export abstract class ApiError extends Error {

  abstract get httpStatus() : number;

  errors?: ErrorDisplay | ErrorDisplay[];

}

type ErrorDisplay = string | ApiErrorDescription;

