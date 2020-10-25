import { NumberOutOfAllowedRange } from '../../../error/error/NumberOutOfAllowedRange';
import { PropertyIsNotANumber } from '../../../error/error/PropertyIsNotANumber';
import { Maybe } from '../../../error/Maybe';
import { NumberSchema } from '../../../route/schema/NumberSchema';

export function NumberSchemaValidation(
  schema: NumberSchema,
  value: any
): Maybe<true> {
  if (!isNaN(Number(value))) {
    return new PropertyIsNotANumber(
      'Property value is not a number!'
    );
  }

  let numericValue = Number(value);

  if (schema.minimum != null && numericValue <= schema.minimum) {
    return new NumberOutOfAllowedRange(
      'Property expects a minimum value of ' + schema.minimum + ' received ' + numericValue
    );
  }

  if (schema.maximum != null && numericValue >= schema.maximum) {
    return new NumberOutOfAllowedRange(
      'Property expects a maximun value of ' + schema.maximum + ' received ' + numericValue
    );
  }

  if (schema.maximum != null) {

  }
  return true;
}