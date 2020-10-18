import { ApiError } from '../../error/ApiError';
import { ApiException } from '../../error/ApiException';
import { FastifyReply } from 'fastify';

export function FastifyErrorHandler(
	response: FastifyReply,
	error: ApiError | ApiException | Error
) {
	if (error instanceof ApiError) {
		response.status(error.httpStatus);
		response.send({
			error: error.message
		});
	} else {
		response.status(500);
		response.send({
			error: error.message
		});
	}
}