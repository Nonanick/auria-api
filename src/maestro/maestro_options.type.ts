import type { IAdapter } from '../adapter/adapter.type';
import type { IRequestPipe } from './composition/request_pipe.type';
import type { UseInMaestro } from './maestro.class';

export interface MaestroOptions {
  adapters : IAdapter[];
  useRoutesFrom : UseInMaestro[];
  requestPipes : IRequestPipe[];
  baseUrl : string;
}