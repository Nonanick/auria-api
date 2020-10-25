import { IApiMaestro } from './IApiMaestro';
import { ApiRequestHandler } from './ApiRequestHandler';
import { ApiCallResolver } from '../resolver/ApiCallResolver';
import { ApiException } from '../error/ApiException';
import { ApiError } from '../error/ApiError';
import { FailedSchemaValidationPolicyEnforcer } from '../validation/policies/property/FailedSchemaValidationPolicy';
import { RequestFlowNotDefined } from '../error/exceptions/RequestFlowNotDefined';
import { SchemaValidator } from './default/SchemaValidator';
import { IApiAdapter } from '../adapter/IApiAdapter';
import { ApiContainer } from '../container/ApiContainer';
import { RouteSchemaEnforcer } from '../validation/policies/schema/RouteSchemaEnforcer';
import * as Default from './default';

export class ApiMaestro extends ApiContainer implements IApiMaestro {

	get baseURL() {
		return '';
	}

	public adapters: {
		[name: string]: IApiAdapter;
	} = {};

	public schemaEnforcer: RouteSchemaEnforcer = Default.SchemaEnforcer;

	public schemaValidator?: FailedSchemaValidationPolicyEnforcer = Default.SchemaValidator;

	public callResolver: ApiCallResolver = Default.RouteResolver;

	constructor() {
		super();
	}

	setCallResolver(resolver: ApiCallResolver): void {
		this.callResolver = resolver;
	}

	setSchemaValidation(validation: FailedSchemaValidationPolicyEnforcer): void {
		this.schemaValidator = validation;
	}

	setSchemaEnforcer(enforcer: RouteSchemaEnforcer): void {
		this.schemaEnforcer = enforcer;
	}

	addAdapter(adapter: IApiAdapter) {
		this.adapters[adapter.name] = adapter;
	}

	handle: ApiRequestHandler = async (route, request, sendResponse, sendError) => {

		// Validate request parameters first
		let isRequestParametersValid = await this.schemaValidator!(route, request);
		if (isRequestParametersValid !== true) {
			sendError(isRequestParametersValid);
			return;
		}

		// Validate Parameters Schema
		let isRequestSchemaValid = await this.schemaEnforcer!(route, request);
		if (isRequestSchemaValid !== true) {
			sendError(isRequestSchemaValid);
			return;
		}

		// Call API
		let apiResponse = await this.callResolver(route, request, sendResponse, sendError);
		if (apiResponse instanceof ApiError || apiResponse instanceof ApiException) {
			sendError(apiResponse);
			return;
		}

		// Any commands for Maestro ? TODO -- what will be exposed to ApiMaestro Command?

		sendResponse(apiResponse);
	};

	start() {

		// Call resolver cannot be undefined
		if (typeof this.callResolver !== "function") {
			throw new RequestFlowNotDefined(
				'API Maestro cannot fullfill request flow, one of its required pieces is missing! -> Resolver'
			);
		}

		// Validate can only be null if policy for validation is dont-validate 
		if (typeof this.schemaValidator !== "function") {
			throw new RequestFlowNotDefined(
				'API Maestro cannot fullfill request flow, one of its required pieces is missing! -> Parameter Validation'
			);
		}

		// Validate schema can only be null if policy for schema is dont-enforce
		if (typeof this.schemaEnforcer !== "function") {
			throw new RequestFlowNotDefined(
				'API Maestro cannot fullfill request flow, one of its required pieces is missing! -> Schema Enforcer'
			);
		}

		for (let adapterName in this.adapters) {
			let adapter = this.adapters[adapterName];
			adapter.setRequestHandler(this.handle);
			adapter.addApiContainer(this);
			adapter.start();
		}

	}

}
