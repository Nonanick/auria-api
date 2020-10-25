import { PropertyValidationPolicyVault } from '../../policies/PropertyValidationPolicyVault.ts';
import { IProxiedApiRoute } from '../../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../../request/IApiRouteRequest';
import { SchemaValidations } from '../../validation/property/SchemaValidations';
import { ValidateSchemaProperties } from '../composition/ValidateSchemaProperties';

export const DefaultPropertyValidationPolicy = 'prevent-execution';

export const SchemaValidator: ValidateSchemaProperties =
	async (route: IProxiedApiRoute, request: IApiRouteRequest) => {

		// Iterate through each origin
		for (let origin in request.parametersByOrigin) {
			let allParams = request.parametersByOrigin[origin];

			// And each parameter
			for (let name in allParams) {
				let value = allParams[name];

				// Is there an schema definition for it?
				if (route.schema?.[origin]?.properties[name] != null) {

					let propertySchema = route.schema?.[origin]?.properties[name]!;
					let isValid = await SchemaValidations[propertySchema.type](propertySchema, value);

					// If property validation fails...
					if (isValid instanceof Error) {
						let policy = PropertyValidationPolicyVault[
							route.schemaValidationPolicy ?? DefaultPropertyValidationPolicy
						];
						let policyAnswer = await policy(
							route,
							request,
							origin,
							name,
							isValid
						);
						// Check for policy (true === continue, else return)
						if (policyAnswer !== true) {
							return policyAnswer;
						}
					}
				}
			}
		}
		return true as true;
	};