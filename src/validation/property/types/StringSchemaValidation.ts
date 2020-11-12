import { IncorrectStringLength } from '../../../error/error/IncorrectStringLength';
import { Maybe, MaybePromise } from '../../../error/Maybe';
import { StringSchema } from '../../../route/schema/StringSchema';

export function StringSchemaValidation(
  schema: StringSchema,
  value: any
): Maybe<true> | MaybePromise<true> {

  let stringfied = String(value);

  if (schema.minLength != null && schema.minLength > stringfied.length) {
    return new IncorrectStringLength('Property expects a minimum length of ' + schema.minLength);
  }

  if (schema.maxLength != null && schema.maxLength < stringfied.length) {
    return new IncorrectStringLength('Property expects a maxmun length of ' + schema.maxLength);
  }

  return true;
}