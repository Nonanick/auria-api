import { container, Lifecycle } from 'tsyringe';
import type { Class } from 'type-fest';

export function Service(token?: string | symbol | Class<any>) {
  return function (prototype: any) {

    let useToken: string | symbol | undefined;

    if (token == null) {
      useToken = prototype.Token ?? prototype.Symbol ?? prototype.name;

    } else {
      if (typeof token === 'string' || typeof token === 'symbol') {
        useToken = token;
      } else {
        useToken = token.name;
      }
    }

    container.register( useToken!, { useClass : prototype }, { lifecycle : Lifecycle.Singleton});
  }
}