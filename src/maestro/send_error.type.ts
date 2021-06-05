import { ApiError } from '../error/api_error.error';
import { ApiException } from '../error/api_exception.error';

export type SendErrorFunction = (error: ApiError | ApiException | Error) => void;