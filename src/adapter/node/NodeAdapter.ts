import { EventEmitter } from 'events';
import { IContainer, IProxiedRoute, IRouteRequest, SendResponseFunction, SendErrorFunction } from '../..';
import { Maestro } from '../../maestro/Maestro';
import { IAdapter } from '../IAdapter';
import { NodeAdapterOptions } from './options/NodeAdapterOptions';
import { createServer, RequestListener, Server } from 'http';
import { TransformRequest } from './transformRequest/TransformRequest';

export class NodeAdapter extends EventEmitter implements IAdapter {

  static DefaultOptions: NodeAdapterOptions = {
    port: 3003
  };

  get name(): string {
    return 'Node';
  }

  protected _options: NodeAdapterOptions;

  protected _server?: Server;

  constructor(options?: NodeAdapterOptions) {
    super();

    this._options = {
      ...NodeAdapter.DefaultOptions,
      ...options ?? {}
    };
  }

  protected _containers: IContainer[] = [];

  addContainer(container: IContainer): void {
    this._containers.push(container);
  }

  protected _requestHandler?: Maestro['handle'];

  setRequestHandler(
    handler: (
      route: IProxiedRoute,
      request: IRouteRequest,
      sendResponse: SendResponseFunction,
      sendError: SendErrorFunction
    ) => Promise<void>
  ): void {
    this._requestHandler = handler;
  }

  protected serverRequestListener: RequestListener = (req, res) => {
    const request = TransformRequest(req, req.url!);

    res.write("Implement node adapter!");
    res.end();

  };

  start(): void {
    this._server = createServer(
      this.serverRequestListener
    );
  }

  stop(): void {
    this._server!.close();
  }
};