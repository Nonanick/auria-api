import { BadRequest } from '../../../error/error/http';
import type { ParameterValidation } from '../../../route';

const fnCache: {
  [n: number]: ParameterValidation<string>
} = {};

export function MaxLength(amount: number) {
  if (fnCache[amount] != null) return fnCache[amount];

  const validation: ParameterValidation<string> = (function (this: number, value: string) {
    return String(value).length > this 
    ? new BadRequest('The maximun length of the string must be lesser than ' + this) 
    : true;
  }).bind(amount);

  fnCache[amount] = validation;

  return validation;
}