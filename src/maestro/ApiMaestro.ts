import { IApiAdapter } from '../adapter/IApiAdapter';
import { ApiContainer } from '../container/ApiContainer';
import { ApiError } from '../error/ApiError';
import { ApiException } from '../error/ApiException';
import { RequestFlowNotDefined } from '../error/exceptions/RequestFlowNotDefined';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../request/IApiRouteRequest';
import { ApiSendErrorFunction } from './ApiSendErrorFunction';
import { ApiSendResponseFunction } from './ApiSendResponseFunction';
import { EnforceRouteSchema } from './composition/EnforceRouteSchema';
import { RequestHandler } from './composition/RequestHandler';
import { ValidateSchemaProperties } from './composition/ValidateSchemaProperties';
import * as Default from './default';
import { IApiMaestro } from './IApiMaestro';

export class ApiMaestro extends ApiContainer implements IApiMaestro {

	get baseURL() {
		return '';
	}

	public adapters: {
		[name: string]: IApiAdapter;
	} = {};

	public schemaEnforcer: EnforceRouteSchema =
		Default.SchemaEnforcer;

	public propertyValidator: ValidateSchemaProperties =
		Default.SchemaValidator;

	public requestHandler: RequestHandler =
		Default.RequestHandler;

	/**
	 * Api Maestro
	 * -----------
	 * 
	 * Mostly responsible for wiring all the elements of the library
	 * Will connect all the adapters to the exposed API Endpoints
	 * enforcing policies and request/response flow inside the app
	 * 
	 */
	constructor() {
		super();
	}

	setRequestHandler(resolver: RequestHandler): void {
		this.requestHandler = resolver;
	}

	addAdapter(adapter: IApiAdapter) {
		this.adapters[adapter.name] = adapter;
	}

	public handle = async (
		route: IProxiedApiRoute,
		request: IApiRouteRequest,
		sendResponse: ApiSendResponseFunction,
		sendError: ApiSendErrorFunction
	) => {

		// Validate request parameters first
		let isRequestParametersValid = await this.propertyValidator(route, request);
		if (isRequestParametersValid !== true) {
			sendError(isRequestParametersValid);
			return;
		}

		// Validate Parameters Schema
		let isRequestSchemaValid = await this.schemaEnforcer(route, request);
		if (isRequestSchemaValid !== true) {
			sendError(isRequestSchemaValid);
			return;
		}

		// Call API Endpoint
		let apiResponse = await this.requestHandler(route, request, sendResponse, sendError);
		if (apiResponse instanceof ApiError || apiResponse instanceof ApiException) {
			sendError(apiResponse);
			return;
		}

		// Any commands for Maestro ? 
		// TODO -- what will be exposed to ApiMaestro Command?

		sendResponse(apiResponse);
	};

	start() {

		if (typeof this.requestHandler !== "function") {
			throw new RequestFlowNotDefined(
				'API Maestro cannot fullfill request flow, one of its required pieces is missing! -> Request Resolver'
			);
		}

		if (typeof this.propertyValidator !== "function") {
			throw new RequestFlowNotDefined(
				'API Maestro cannot fullfill request flow, one of its required pieces is missing! -> Property Validation'
			);
		}

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
