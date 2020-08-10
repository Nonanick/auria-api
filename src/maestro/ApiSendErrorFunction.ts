import { ApiError } from '../error/ApiError';
import { ApiException } from '../error/ApiException';

export type ApiSendErrorFunction = (error : ApiError | ApiException | Error) => void;