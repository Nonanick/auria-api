import { Response, NextFunction } from 'express';
import { ApiError } from '../../error/ApiError';
import { ApiException } from '../../error/ApiException';
import { constants } from 'http2';

export function ExpressErrorHandler(response: Response, next: NextFunction, error: ApiError | ApiException | Error) {
	if (error instanceof ApiError) {
		response.status(error.httpStatus);
		response.send({
			error: error.message
		});
	} else {
		next(error);
	}
}