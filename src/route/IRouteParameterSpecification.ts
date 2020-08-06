import { PropertyValidationFunction, PropertySanitizerFunction} from 'auria-data';

export interface IRouteParameterSpecification {
  name : string;
  origin? : string;
  validate? : PropertyValidationFunction | PropertyValidationFunction[];
  sanitize? : PropertySanitizerFunction | PropertySanitizerFunction[];
}