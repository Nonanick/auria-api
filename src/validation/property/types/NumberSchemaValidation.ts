import { Maybe } from '../../../error/Maybe';
import { NumberSchema } from '../../../route/schema/NumberSchema';

export function NumberSchemaValidation(
  schema: NumberSchema,
  value: any
): Maybe<true> {
  return true;
}