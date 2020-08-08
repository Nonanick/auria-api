import { IApiRouteResponse } from '../../response/IApiRouteResponse';
import { Response } from 'express';
import { ExpressCommands } from './ExpressCommands';
import { ExpressAdapter } from './ExpressAdapter';
import { IApiCommand } from '../../command/IApiCommand';

export function ExpressSendResponse(routeResp: IApiRouteResponse, response: Response) {
  let send = { ...routeResp };
  delete send.status;
  delete send.commands;

  if (routeResp.commands != null) {
    applyCommandsToResponse(response, routeResp.commands)
  }
  response.status(routeResp.status).send(send);

}

function applyCommandsToResponse(response: Response, commands: IApiCommand | IApiCommand[]) {

  if (Array.isArray(commands)) {
    for (let command of commands!) {
      applyCommandsToResponse(response, command);
    }
  } else {
    // Accepts array of adapters?
    if (Array.isArray(commands.adapters)) {
      // Is Express not one of them?
      if (!commands.adapters.includes(ExpressAdapter.ADAPTER_NAME)) {
        return;
      }
    }

    // Unspecified adapter or Express adapter ?
    if (commands.adapters == null || commands.adapters === ExpressAdapter.ADAPTER_NAME) {
      // Known command ?
      if ((ExpressCommands as any)[commands.name] != null) {
        (ExpressCommands as any)[commands.name](response, commands.payload);
      }
    }
  }
}