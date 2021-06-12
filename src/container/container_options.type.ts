import { IController } from '../controller/controller.type';
import { ServiceProviderAndOptions } from '../maestro/maestro_options.type';
import { IContainer } from './container.type';

export interface ContainerOptions {
  controllers : IController[];
  containers : IContainer[];
  services : {
    [token in string | symbol] : ServiceProviderAndOptions;
  };

}