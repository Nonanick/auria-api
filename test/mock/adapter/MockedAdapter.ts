import type { IAdapter } from '../../../dist/adapter/IAdapter';
import { EventEmitter } from 'events';
import type { IContainer } from '../../../dist/container/IContainer';
import type { MaestroRequestHandler } from '../../../dist/maestro/Maestro';

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