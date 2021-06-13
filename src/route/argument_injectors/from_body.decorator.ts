import { JSONPath } from 'jsonpath-plus';
import { ControllerRoutesSymbol } from '../../controller/route.decorator';
import type { IProxiedRoute } from '../../proxy/proxied_route.type';
import type { IRouteRequest } from '../../request/route_request.type';
import { AddJsonPathToSchema } from '../../util/jsonpath_to_schema.fn';
import { HandlerInjectorSymbol } from '../injectable_handler.type';
import type { IRoute } from '../route.type';
import { JSONSchema } from '../schema';
import { ParameterTransformation } from './parameter_transformation.type';
import { ParameterValidation } from './parameter_validation.type';

export function FromBody(options: FromBodyOptions) {

  return function (proto: any, property: string, index: number) {

    // Initialize object, if empty
    if (proto[HandlerInjectorSymbol] == null) {
      proto[HandlerInjectorSymbol] = {
        [property]: []
      };
    }

    // Add property to route schema
    AddOptionsToSchema(proto, property, options);

    // Create injector
    proto[HandlerInjectorSymbol][property][index] = async (_route : IRoute, request : IRouteRequest) => {
      // Recover value from body
      let value = InjectArgumentFromBody(request, options.property);
      
      // Apply transform functions, if any
      if(Array.isArray(options.transform)) {
        for(let transform of options.transform) {
          if(typeof transform === "function") { 
            let maybeValue = await transform(value);
            if(maybeValue instanceof Error) {
              return maybeValue;
            }
            value = maybeValue;
          } else {
            console.error('"Transform Parameter" in "inject argument from body" is not a function!');
          }
        }
      }
      return value;
    }

  }
}

function InjectArgumentFromBody( request : IRouteRequest, propertyPath : string) {
  const values = JSONPath({
    path : propertyPath,
    autostart : true,
    json : request.byOrigin!.body,
    preventEval : true,
    wrap : false
  });

  return values;
}

function AddOptionsToSchema(
  proto: any,
  property: string,
  options: FromBodyOptions
) {

  let blankBodySchema: Partial<IProxiedRoute> = {
    controller: proto,
    resolver: property as string,
    schema: {
      body: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      }
    }
  };

  if (proto[ControllerRoutesSymbol] == null) {
    proto[ControllerRoutesSymbol] = {};
  }

  let route: Partial<IProxiedRoute> = proto[ControllerRoutesSymbol]?.[property];

  // Initialize route, if empty
  if (route == null) route = blankBodySchema;

  // Initialize schema, if empty
  if (route.schema == null) route.schema = blankBodySchema.schema;

  // Initialize schema body, if empty
  if (route.schema?.body == null) route.schema!.body = blankBodySchema.schema?.body;

  // Add schema to body properties
  // -- Convert JSONPath to JSON schema, always references root!
  AddJsonPathToSchema(
    route.schema!.body!,
    options.property, 
    options, 
    options.required !== false
    );

  // reassign route to prototype
  proto[ControllerRoutesSymbol][property] = route;

}

type FromBodyOptions = JSONSchema  & { 
  property : string;
  validations? : ParameterValidation[];
  transform? : ParameterTransformation[];
  required? : boolean;
};