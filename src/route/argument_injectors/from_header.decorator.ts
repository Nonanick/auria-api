import { JSONPath } from 'jsonpath-plus';
import { ControllerRoutesSymbol } from '../../controller/route.decorator';
import { IProxiedRoute } from '../../proxy/proxied_route.type';
import { IRouteRequest } from '../../request/route_request.type';
import { AddJsonPathToSchema } from '../../util/jsonpath_to_schema.fn';
import { HandlerInjectorSymbol } from '../injectable_handler.type';
import { IRoute } from '../route.type';
import { StringSchema } from '../schema';
import { ParameterTransformation } from './parameter_transformation.type';
import { ParameterValidation } from './parameter_validation.type';

export function FromHeader(options: string | FromHeaderOptions) {

  return function (proto: any, property: string, index: number) {

    // Initialize object, if empty
    if (proto[HandlerInjectorSymbol] == null) {
      proto[HandlerInjectorSymbol] = {
        [property]: []
      };
    }

    let resolvedOptions : FromHeaderOptions = typeof options === "string" ? {
      type : 'string',
      property : options,
      required : false,
    } : options;
    

    AddOptionsToSchema(
      proto, 
      property, 
      resolvedOptions
    );

      // Create injector
      proto[HandlerInjectorSymbol][property][index] = async (_route : IRoute, request : IRouteRequest) => {
        // Recover value from body
        let value = InjectArgumentFromHeader(request, resolvedOptions.property);
        
        // Apply transform functions, if any
        if(Array.isArray(resolvedOptions.transform)) {
          for(let transform of resolvedOptions.transform) {
            if(typeof transform === "function") { 
              let maybeValue = await transform(value);
              if(maybeValue instanceof Error) {
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
  options: FromHeaderOptions
) {

  let blankHeaderSchema: Partial<IProxiedRoute> = {
    controller: proto,
    resolver: property as string,
    schema: {
     header : {
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

function InjectArgumentFromHeader( request : IRouteRequest, propertyPath : string) {
  const values = JSONPath({
    path : propertyPath,
    autostart : true,
    json : request.byOrigin!.header,
    preventEval : true,
  });

  return values;
}

type FromHeaderOptions = StringSchema & {
  property: string;
  validations?: ParameterValidation<string>[];
  transform?: ParameterTransformation<string>[];
  required?: boolean;
};