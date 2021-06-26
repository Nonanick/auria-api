import type { ParameterValidation } from '../../../route';
import isSafe from 'safe-regex';
import { BadRequest } from '../../../error/error/http';

const fnCache: Map<string | RegExp, ParameterValidation> = new Map;

export function Matches(expression: RegExp | string) {
  if (
    !isSafe(expression)
    && String(process.env.ALLOW_UNSAFE_REGEX) !== "true"
  ) {
    throw new Error(
      '[Maestro] This regular expression "' + expression.toString() + '" is either incorrect or can be exploited!'
      + ' Since it shall be facing user input the default behaviour is to throw an error!'
      + ' If you know about reDOS and still want to proceed/ignore just create a .env variable called "ALLOW_UNSAFE_REGEX" and set it to "true"!'
    );
  }
  if (fnCache.has(expression)) return fnCache.get(expression)!;

  const validation: ParameterValidation<string> = (function (this: RegExp, value: string) {
    return String(value).match(this)
      ? new BadRequest('The maximun length of the string must be lesser than ' + this)
      : true;
  }).bind(typeof expression === "string" ? new RegExp(expression) : expression);

  fnCache.set(expression, validation);

  return validation;
}