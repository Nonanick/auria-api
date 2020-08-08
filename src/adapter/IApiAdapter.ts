import { IApiContainer } from '../container/IApiContainer';

export interface IApiAdapter {

  readonly name : string;
  addApiContainer(container: IApiContainer): void;
  run(): void;

}