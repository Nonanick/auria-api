import type { InjectionToken } from 'tsyringe';
import type { ServiceProviderAndOptions } from '../maestro/maestro_options.type';

export interface IServiceProvider {
  services() : [token: InjectionToken, service : ServiceProviderAndOptions ][];
}

export function isServiceProvider(obj : any) : obj is IServiceProvider {
  return (
    typeof obj.services === 'function'
  );
}