import { Maybe } from '../../../error/Maybe';
import { StringSchema } from '../../../route/schema/StringSchema';

export function StringSchemaValidation(
  schema: StringSchema,
  value: any
): Maybe<true> {
  return true;
}