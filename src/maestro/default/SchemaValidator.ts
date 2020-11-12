import { MaybePromise } from 'error/Maybe';
import { ApiError } from '../../error/ApiError';
import { PropertyValidationPolicyVault } from '../../policies/PropertyValidationPolicyVault.ts';
import { IProxiedRoute } from '../../proxy/IProxiedRoute';
import { IRouteRequest } from '../../request/IRouteRequest';
import { SchemaValidations } from '../../validation/property/SchemaValidations';

export const DefaultPropertyValidationPolicy = 'prevent-execution';

export async function SchemaValidator(
	route: IProxiedRoute,
	request: IRouteRequest
): MaybePromise<true> {

	// Iterate through each origin
	for (let origin in request.byOrigin) {
		const allParams = request.byOrigin[origin];

		// And each parameter
		for (let name in allParams) {
			const value = allParams[name];

			// Is there an schema definition for it?
			if (route.schema?.[origin]?.properties[name] != null) {

				const propertySchema = route.schema?.[origin]?.properties[name]!;

				const passedSchemaValidation = await SchemaValidations[propertySchema.type](propertySchema, value);
				const passedDefinedValidation = await propertySchema.validate?.(value, request) ?? true;

				// If any property validation fails...
				if (
					passedSchemaValidation instanceof Error
					|| passedDefinedValidation instanceof Error
				) {

					const error = passedSchemaValidation instanceof Error
						? passedSchemaValidation
						: passedDefinedValidation as ApiError;

					const applyPolicy = PropertyValidationPolicyVault[
						route.schemaValidationPolicy ?? DefaultPropertyValidationPolicy
					];
					const policyResponse = await applyPolicy(
						route,
						request,
						origin,
						name,
						error!
					);
					// Check for policy (true === continue, else return the error)
					if (policyResponse !== true) {
						return policyResponse;
					}
				}
			}
		}
	}
	return true as true;
};