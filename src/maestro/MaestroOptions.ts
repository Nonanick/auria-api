import type { IAdapter } from '../adapter/IAdapter';
import type { IRequestPipe } from './composition/RequestPipe';
import type { UseInMaestro } from './Maestro';

export interface MaestroOptions {
  adapters : IAdapter[];
  useRoutesFrom : UseInMaestro[];
  requestPipes : IRequestPipe[];
  baseUrl : string;
}