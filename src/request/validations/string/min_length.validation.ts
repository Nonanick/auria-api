import { BadRequest } from '../../../error/error/http';
import type { ParameterValidation } from '../../../route';

const fnCache: {
  [n: number]: ParameterValidation<string>
} = {};

export function MinLength(amount: number) {

  if (fnCache[amount] != null) return fnCache[amount];

  const validation: ParameterValidation<string> = (function (this: number, value: string) {
    return String(value).length >= this
      ? true
      : new BadRequest('The minimal length of the string must be greater or equal to ' + this);
  }).bind(amount);

  fnCache[amount] = validation;

  return validation;
}