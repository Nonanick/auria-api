import { ApiErrorDescription } from "./api_error_description.type";
import { ApiException } from './api_exception.error';

export abstract class ApiError extends Error {
  public static stringfyApiErrorDescription(desc: ApiErrorDescription): string {
    return `ERROR ${desc.code} - ${desc.title}
-------------------------------------------------
${desc.reason}${desc.hint != null ? "\nHint:\n" + desc.hint : ""
      }${desc.example != null ? "\nExample:\n" + desc.example : ""
      }`;
  }

  abstract get httpStatus(): number;

  errors?: ErrorDisplay | ErrorDisplay[];

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

    this.errors = error;
  }
}

export type ErrorDisplay = string | string[] | ApiErrorDescription | ApiError | ApiException;
