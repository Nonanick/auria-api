import { Maybe } from '../../../error/Maybe';
import { ArraySchema } from '../../../route/schema/ArraySchema';
import { StringSchema } from '../../../route/schema/StringSchema';

export function ArraySchemaValidation(
  schema: ArraySchema,
  value: any
): Maybe<true> {
  return true;
}