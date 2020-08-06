import { IApiRoute } from '../route/IApiRoute';

export type ApiControllerDefaultRouteConfig = Pick<
Partial<IApiRoute>,
"optionalParametersValidationPolicy" | "parameterSchemaPolicy" | "requiredParameters"
>;