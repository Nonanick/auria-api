import type { IController } from '../controller/controller.type';
import type { ServiceProviderAndOptions } from '../maestro/maestro_options.type';
import type { IContainer } from './container.type';
import type { Class } from 'type-fest';

export interface ContainerOptions {
  controllers : ( Class<IController> | IController)[];
  containers : IContainer[];
  services : {
    [token in string | symbol] : ServiceProviderAndOptions;
  };

}