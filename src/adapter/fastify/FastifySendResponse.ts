import { IApiRouteResponse } from '../../response/IRouteResponse';
import { IApiCommand } from '../../command/IApiCommand';
import { FastifyReply } from 'fastify';
import { FastifyAdapter } from './FastifyAdapter';
import { FastifyCommands } from './FastifyCommands';

export function FastifySendResponse(
	routeResp: IApiRouteResponse,
	response: FastifyReply,
	resolve: (value?: any) => void
) {
	// Cannot resolve a promise with null/undefined!
	let send = routeResp.payload ?? {};
	if (routeResp.commands != null) {
		applyCommandsToResponse(
			response,
			routeResp.commands
		);
	}

	response
		.header(
			'X-Exit-Code',
			routeResp.exitCode
		);

	response
		.status(routeResp.status);

	resolve(send);
}

function applyCommandsToResponse(response: FastifyReply, commands: IApiCommand | IApiCommand[]) {

	if (Array.isArray(commands)) {
		for (let command of commands!) {
			applyCommandsToResponse(response, command);
		}
	} else {
		// Accepts array of adapters?
		if (Array.isArray(commands.adapters)) {
			// Is Express not one of them?
			if (!commands.adapters.includes(FastifyAdapter.ADAPTER_NAME)) {
				return;
			}
		}

		// Unspecified adapter or Express adapter ?
		if (commands.adapters == null || commands.adapters === FastifyAdapter.ADAPTER_NAME) {
			// Known command ?
			if ((FastifyCommands as any)[commands.name] != null) {
				(FastifyCommands as any)[commands.name](response, commands.payload);
			}
		}
	}
}