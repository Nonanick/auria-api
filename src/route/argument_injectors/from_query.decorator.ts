import { JSONPath } from 'jsonpath-plus';
import { ControllerRoutesSymbol } from '../../controller/route.decorator';
import { IProxiedRoute } from '../../proxy/proxied_route.type';
import { IRouteRequest } from '../../request/route_request.type';
import { AddJsonPathToSchema } from '../../util/jsonpath_to_schema.fn';
import { HandlerInjectorSymbol } from '../injectable_handler.type';
import { IRoute } from '../route.type';
import { ArraySchema, BooleanSchema, NumberSchema, StringSchema } from '../schema';
import { ParameterTransformation } from './parameter_transformation.type';
import { ParameterValidation } from './parameter_validation.type';

export function Query(options: FromQueryOptions) {

  return function (proto: any, property: string, index: number) {

    // Initialize object, if empty
    if (proto[HandlerInjectorSymbol] == null) {
      proto[HandlerInjectorSymbol] = {
        [property]: []
      };
    }

    AddOptionsToSchema(
      proto,
      property,
      options
    );

    // Create injector
    proto[HandlerInjectorSymbol][property][index] = async (_route: IRoute, request: IRouteRequest) => {
      // Recover value from body
      let value = InjectArgumentFromQuery(request, options.property);

      // Apply transform functions, if any
      if (Array.isArray(options.transform)) {
        for (let transform of options.transform) {
          if (typeof transform === "function") {
            let maybeValue = await transform(value);
            if (maybeValue instanceof Error) {
              return maybeValue;
            }
            value = maybeValue;
          } else {
            console.error('"transform parameter" in "inject argument from header" is not a function!');
          }
        }
      }

      return value;
    }
  }


}


function AddOptionsToSchema(
  proto: any,
  property: string,
  options: FromQueryOptions
) {

  let blankHeaderSchema: Partial<IProxiedRoute> = {
    controller: proto,
    resolver: property as string,
    schema: {
      header: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: true,
      }
    }
  };

  if (proto[ControllerRoutesSymbol] == null) {
    proto[ControllerRoutesSymbol] = {};
  }

  let route: Partial<IProxiedRoute> = proto[ControllerRoutesSymbol]?.[property];

  // Initialize route, if empty
  if (route == null) route = blankHeaderSchema;

  // Initialize schema, if empty
  if (route.schema == null) route.schema = blankHeaderSchema.schema;

  // Initialize schema body, if empty
  if (route.schema?.body == null) route.schema!.header = blankHeaderSchema.schema?.header;

  // Add schema to body properties
  // -- Convert JSONPath to JSON schema, always references root!
  AddJsonPathToSchema(
    route.schema!.header!,
    options.property,
    options,
    options.required !== false
  );

  // reassign route to prototype
  proto[ControllerRoutesSymbol][property] = route;

}

function InjectArgumentFromQuery(request: IRouteRequest, propertyPath: string) {
  const values = JSONPath({
    path: propertyPath,
    autostart: true,
    json: request.byOrigin!.query,
    preventEval: true,
  });

  return values;
}

type FromQueryOptions = (StringSchema | NumberSchema | BooleanSchema | ArraySchema) & {
  property: string;
  validations?: ParameterValidation<string | number | boolean | (string | number | boolean)[]>[];
  transform?: ParameterTransformation<string | number | boolean | (string | number | boolean)[]>[];
  required?: boolean;
};