import { ApiError } from '../../error/ApiError';
import { ApiException } from '../../error/ApiException';
import { FastifyReply } from 'fastify';

export function FastifyErrorHandler(
	response: FastifyReply,
	error: ApiError | ApiException | Error,
	resolve: (value?: any) => void,
	reject: (reason?: any) => void
) {
	if (error instanceof ApiError) {
		response.status(error.httpStatus);
		response.send(error.message);
		resolve(error.message);
	} else {
		response.status(500);
		reject(error.message);
	}
}