import { JSONPath } from 'jsonpath-plus';
import { ControllerRoutesSymbol } from '../../controller/route.decorator';
import { BadRequest } from '../../error/error/http';
import { Log } from '../../logger/logger.class';
import type { IProxiedRoute } from '../../proxy/proxied_route.type';
import type { IRouteRequest } from '../../request/route_request.type';
import { AddJsonPathToSchema } from '../../util/jsonpath_to_schema.fn';
import { StripFromObject } from '../../util/strip_from_object.fn';
import { HandlerInjectorSymbol } from '../injectable_handler.type';
import type { IRoute } from '../route.type';
import { JSONSchema } from '../schema';
import { ParameterTransformation } from './parameter_transformation.type';
import { ParameterValidation } from './parameter_validation.type';

export function Body(options: FromBodyOptions) {

  return function (proto: any, property: string, index: number) {

    // Initialize object, if empty
    if (proto[HandlerInjectorSymbol] == null) {
      proto[HandlerInjectorSymbol] = {
        [property]: []
      };
    }
    if (proto[HandlerInjectorSymbol][property] == null) {
      proto[HandlerInjectorSymbol][property] = [];
    }

    InitializeRoute(proto, property);

    AddOptionsToRoute(proto, property, options);

    // Add property to route schema
    AddOptionsToSchema(proto, property, options);

    // Create injector
    proto[HandlerInjectorSymbol][property][index] = async (_route: IRoute, request: IRouteRequest) => {
      // Recover value from body
      let value = InjectArgumentFromBody(request, options.property);

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
            Log.error(transform, '"Transform Parameter" in "inject argument from body" is not a function!');
          }
        }
      }
      return value;
    }

  }
}

function InjectArgumentFromBody(request: IRouteRequest, propertyPath: string) {
  const values = JSONPath({
    path: propertyPath,
    autostart: true,
    json: request.byOrigin!.body,
    preventEval: true,
    wrap: false
  });

  return values;
}

function AddOptionsToRoute(
  proto: any,
  property: string,
  options: FromBodyOptions
) {

  let route: Partial<IProxiedRoute> = proto[ControllerRoutesSymbol][property];

  // Add validations to route
  if (options.validations != null && Array.isArray(route.validate)) {

    route.validate!.push({
      name: 'Validation of property @body/' + property,
      validate: async (params) => {
        let propValue = params.body[options.property]
        Log.info(params.body[options.property]);

        const allErrors = (await Promise.all(
          options.validations!.map(validation => validation(propValue))
        )).filter(valid => valid !== true);

        if (allErrors.length > 0) {
          return new BadRequest(
            'Failed to validate property @body/' + options.property + '! \n'
            + allErrors.map((e) => (e as Error).message).join(' and ')
          );
        }
        return true;
      }
    });
  }
}

function InitializeRoute(proto: any, property: string) {
  let blankBodySchema: Partial<IProxiedRoute> = {
    controller: proto,
    validate : [],
    resolver: property as string,
    schema: {
      body: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      }
    },
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

  // reassign route to prototype
  proto[ControllerRoutesSymbol][property] = route;
}

function AddOptionsToSchema(
  proto: any,
  property: string,
  options: FromBodyOptions
) {

  let route: Partial<IProxiedRoute> = proto[ControllerRoutesSymbol]?.[property];

  // Add schema to body properties
  // -- Convert JSONPath to JSON schema, always references root!
  AddJsonPathToSchema(
    route.schema!.body!,
    options.property,
    StripFromObject(options, ['validations', 'transform', 'required', 'property']),
    options.required !== false
  );

  // reassign route to prototype
  proto[ControllerRoutesSymbol][property] = route;

}

type FromBodyOptions = JSONSchema & {
  property: string;
  validations?: ParameterValidation[];
  transform?: ParameterTransformation[];
  required?: boolean;
};