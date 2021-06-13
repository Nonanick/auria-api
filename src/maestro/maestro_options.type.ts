import type { IAdapter } from '../adapter/adapter.type';
import type { IRequestPipe } from './composition/request_pipe.type';
import type { UseInMaestro } from './maestro.class';
import type { DependencyContainer, ClassProvider, TokenProvider, FactoryProvider, ValueProvider, RegistrationOptions } from 'tsyringe';

export interface MaestroOptions {
  container : DependencyContainer;
  adapters: IAdapter[];
  useRoutesFrom: UseInMaestro[];
  requestPipes: IRequestPipe[];
  services: {
    [token in string | symbol]: ServiceProviderAndOptions;
  };
  baseUrl: string;
}

export type ServiceProviderAndOptions =
  Partial<RegistrationOptions>
  &
  (
    | ClassProvider<any>
    | TokenProvider<any>
    | FactoryProvider<any>
    | ValueProvider<any>
  )