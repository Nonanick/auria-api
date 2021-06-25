import { container, Lifecycle } from 'tsyringe';
import type { Class } from 'type-fest';

export function Service(
  token?: string | symbol | Class<any>
) {
  return function (prototype: any) {
    let useToken: string | symbol | undefined = ResolveToken(token ?? prototype);
    container.register(useToken!, { useClass: prototype }, { lifecycle: Lifecycle.Singleton });
  }
}

export function Inject<Return = any>(
  token: string | symbol | Class<any>
): Return {
  return container.resolve(ResolveToken(token)) as Return;
}

function ResolveToken(token: string | symbol | Class<any>) : symbol {
  
  if(typeof token === "symbol") return token;

  if(typeof token === "string") return Symbol.for(token);

  if((token as any).Token !== null) return ResolveToken((token as any).Token);

  if((token as any).Symbol !== null) return ResolveToken((token as any).Symbol);

  return Symbol.for(token.constructor.name);

}