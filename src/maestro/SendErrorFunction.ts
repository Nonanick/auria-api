import { ApiError } from '../error/ApiError';
import { ApiException } from '../error/ApiException';

export type SendErrorFunction = (error: ApiError | ApiException | Error) => void;