import { Maybe } from '../error/maybe.type';

export interface IRouteParameterSpecification {
  name: string;
  origin?: string;
  validate?: PropertyValidationFunction | PropertyValidationFunction[];
  sanitize?: PropertySanitizerFunction | PropertySanitizerFunction[];
}

export type PropertyValidationFunction = (value: any) => Maybe<true> | Promise<Maybe<true>>;
export type PropertySanitizerFunction = (value: any) => any | Promise<any>;

export function isRouteParameterSpecification(param: any): param is IRouteParameterSpecification {
  return (
    typeof param.name === 'string'
    && (typeof param.origin === 'string' || param.origin === undefined)
    && (typeof param.validate === 'function' || Array.isArray(param.validate) || param.validate === undefined)
    && (typeof param.sanitize === 'function' || Array.isArray(param.sanitize) || param.sanitize === undefined)
  );
}