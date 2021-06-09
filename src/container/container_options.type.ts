import { Class } from 'type-fest';
import { IController } from '../controller/controller.type';
import { IService } from '../service/service.type';
import { IContainer } from './container.type';

export interface ContainerOptions {
  controllers : IController[];
  containers : IContainer[];
  services : {
    [name in string | symbol] : Class<IService>;
  };

}