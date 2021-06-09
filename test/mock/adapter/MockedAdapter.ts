import { EventEmitter } from 'events';
import { IAdapter } from '../../../dist/adapter/adapter.type';
import { IContainer } from '../../../dist/container/container.type';
import { MaestroRequestHandler } from '../../../dist/maestro/maestro.class';

export class MockedAdapter extends EventEmitter implements IAdapter {

  name: string = "Mocked Adapter";

  addContainer(container: IContainer): void {
    throw new Error('Method not implemented.');
  }

  setRequestHandler(handler: MaestroRequestHandler): void {
    throw new Error('Method not implemented.');
  }

  start(): void {
    throw new Error('Method not implemented.');
  }

}