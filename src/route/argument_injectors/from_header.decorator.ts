import { JSONPath } from 'jsonpath-plus';
import { ControllerRoutesSymbol } from '../../controller/route.decorator';
import { BadRequest } from '../../error/error/http';
import { Log } from '../../logger/logger.class';
import { IProxiedRoute } from '../../proxy/proxied_route.type';
import { IRouteRequest } from '../../request/route_request.type';
import { AddJsonPathToSchema } from '../../util/jsonpath_to_schema.fn';
import { StripFromObject } from '../../util/strip_from_object.fn';
import { HandlerInjectorSymbol } from '../injectable_handler.type';
import { IRoute } from '../route.type';
import { StringSchema } from '../schema';
import { IValidateRoute } from '../validation/validate_route.type';
import { ParameterTransformation } from './parameter_transformation.type';
import { ParameterValidation } from './parameter_validation.type';

export function Header(options: string | FromHeaderOptions) {

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

    let resolvedOptions: FromHeaderOptions = typeof options === "string" ? {
      type: 'string',
      property: options,
      required: false,
    } : options;

    InitializeRoute(
      proto,
      property
    );

    AddOptionsToRoute(
      proto,
      property,
      resolvedOptions
    );

    AddOptionsToSchema(
      proto,
      property,
      resolvedOptions,
    );

    // Create injector
    proto[HandlerInjectorSymbol][property][index] = async (_route: IRoute, request: IRouteRequest) => {
      // Recover value from body
      let value = InjectArgumentFromHeader(request, resolvedOptions.property);

      // Apply transform functions, if any
      if (Array.isArray(resolvedOptions.transform)) {
        for (let transform of resolvedOptions.transform) {
          if (typeof transform === "function") {
            let maybeValue = await transform(value);
            if (maybeValue instanceof Error) {
              return maybeValue;
            }
            value = maybeValue;
          } else {
            Log.error(transform, '"transform parameter" in "inject argument from header" is not a function!');
          }
        }
      }

      return value;
    }
  }


}

function InitializeRoute(
  proto: any,
  property: string
) {
  let blankHeaderSchema: Partial<IProxiedRoute> = {
    controller: proto,
    validate: [],
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

  // reassign route to prototype
  proto[ControllerRoutesSymbol][property] = route;
}

function AddOptionsToRoute(
  proto: any,
  property: string,
  options: FromHeaderOptions
) {

  let route: Partial<IProxiedRoute> = proto[ControllerRoutesSymbol][property];

  // Add validations to route
  if (options.validations != null && Array.isArray(route.validate)) {
    let validations = route!.validate as Array<IValidateRoute>;

    route.validate!.push({
      name: 'Validation of property ' + property,
      validate: async (params) => {
        let propValue = params.header[property]

        const allErrors = (await Promise.all(
          options.validations!.map(validation => validation(propValue))
        )).filter(valid => valid !== true);

        if (allErrors.length > 0) {
          return new BadRequest(
            'Failed to validate property "' + property + '"!\n'
            + allErrors.map((e) => (e as Error).message).join(' and ')
          );
        }
        return true;
      }
    });
  }
}

function AddOptionsToSchema(
  proto: any,
  property: string,
  options: FromHeaderOptions
) {

  let route: Partial<IProxiedRoute> = proto[ControllerRoutesSymbol]?.[property];

  // Add schema to body properties
  // -- Convert JSONPath to JSON schema, always references root!
  AddJsonPathToSchema(
    route.schema!.header!,
    options.property,
    StripFromObject(options, ['validations', 'transform', 'required', 'property']),
    options.required !== false
  );

  // reassign route to prototype
  proto[ControllerRoutesSymbol][property] = route;

}

function InjectArgumentFromHeader(request: IRouteRequest, propertyPath: string) {
  const values = JSONPath({
    path: propertyPath,
    autostart: true,
    json: request.byOrigin!.header,
    preventEval: true,
    wrap: false
  });

  return values;
}

type FromHeaderOptions = StringSchema & {
  property: string;
  validations?: ParameterValidation<string>[];
  transform?: ParameterTransformation<string>[];
  required?: boolean;
};