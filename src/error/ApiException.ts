import { ApiError, ErrorDisplay } from './ApiError';

export abstract class ApiException extends Error {

  abstract get code(): string;

  constructor(...error: ErrorDisplay[]) {
    super(
      error
        .map((e) =>
          typeof e === "string"
            ? e
            : e instanceof Error
              ? e.message
              : Array.isArray(e)
                ? e.join(',')
                : ApiError.stringfyApiErrorDescription(e)
        )
        .join("\n")
    );

  }
}