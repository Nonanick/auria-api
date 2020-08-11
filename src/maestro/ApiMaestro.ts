import { IApiMaestro } from "./IApiMaestro";
import { ApiCallResolver } from "../resolver/ApiCallResolver";
import { ApiException } from "../error/ApiException";
import { ApiError } from "../error/ApiError";
import { ValidateApiCallFunction } from "../validation/ValidateApiCallFunction";
import { RequestFlowNotDefined } from "../error/exceptions/RequestFlowNotDefined";
import { DefaultCallRouteResolver } from "./default/DefaultCallRouteResolver";
import { DefaultParameterValidator } from "./default/DefaultParameterValidator";
import { DefaultSchemaValidator } from "./default/DefaultSchemaValidator";
import { IProxiedApiRoute } from "../proxy/IProxiedApiRoute";
import { IApiRouteRequest } from "../request/IApiRouteRequest";
import { ApiSendResponseFunction } from "./ApiSendResponseFunction";
import { ApiSendErrorFunction } from "./ApiSendErrorFunction";

export class ApiMaestro implements IApiMaestro {

  public validateRequestParameters: ValidateApiCallFunction = DefaultParameterValidator;

  public validateRequestSchema: ValidateApiCallFunction = DefaultSchemaValidator;

  public callResolver: ApiCallResolver = DefaultCallRouteResolver;

  setCallResolver(resolver: ApiCallResolver): void {
    this.callResolver = resolver;
  }

  setParameterValidation(validation: ValidateApiCallFunction): void {
    this.validateRequestParameters = validation;
  }

  setSchemaValidation(validation: ValidateApiCallFunction): void {
    this.validateRequestSchema = validation;
  }

  async handle(
    route: IProxiedApiRoute,
    request: IApiRouteRequest,
    sendResponse: ApiSendResponseFunction,
    sendError: ApiSendErrorFunction
  ) {

    // Call resolver cannot be undefined
    if (typeof this.callResolver !== "function") {
      console.error('Maestro requires "callResolver" to be defined!');
      sendError(
        new RequestFlowNotDefined(
          "API Maestro cannot fullfill request flow, one of its required pieces is missing!"
        )
      );
      return;
    }

    // Validate can only be null if policy for validation is dont-validate
    if (
      typeof this.validateRequestParameters !== "function" &&
      route.parametersValidationPolicy !== "dont-validate"
    ) {
      console.error(
        'Maestro requires "validateRequest" to be defined! Route specifies its validation policy as ',
        route.parametersValidationPolicy
      );
      sendError(
        new RequestFlowNotDefined(
          "API Maestro cannot fullfill request flow, one of its required pieces is missing!"
        )
      );
      return;
    }

    // Validate schema can only be null if policy for schema is dont-validate
    if (
      typeof this.validateRequestSchema !== "function" &&
      route.parameterSchemaPolicy !== "dont-validate"
    ) {
      console.error(
        'Maestro requires "validateSchema" to be defined! Route specifies its validation policy as ',
        route.parameterSchemaPolicy
      );
      sendError(
        new RequestFlowNotDefined(
          "API Maestro cannot fullfill request flow, one of its required pieces is missing!"
        )
      );
      return;
    }

    // Validate Parameter Policies
    if (route.parametersValidationPolicy !== "dont-validate") {
      let isRequestParametersValid = await this.validateRequestParameters!(
        route,
        request
      );
      if (isRequestParametersValid !== true) {
        sendError(isRequestParametersValid);
        return;
      }
    }

    // Validate Parameters Schema
    if (route.parameterSchemaPolicy !== "dont-validate") {
      let isRequestSchemaValid = await this.validateRequestSchema!(
        route,
        request
      );
      if (isRequestSchemaValid !== true) {
        sendError(isRequestSchemaValid);
        return;
      }
    }

    // Call API
    let apiResponse = await this.callResolver(
      route,
      request,
      sendResponse,
      sendError
    );
    if (
      apiResponse instanceof ApiError ||
      apiResponse instanceof ApiException
    ) {
      sendError(apiResponse);
      return;
    }

    // Any commands for Maestro ? TODO -- what will be exposed to ApiMaestro Command?
    sendResponse(apiResponse);
  }
}
