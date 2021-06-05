export interface HTTPError {
  readonly httpCode : number;
}

export function isHTTPError(obj : any) : obj is (Error & HTTPError) {
  return (
    obj instanceof Error
    && typeof (obj as any).httpCode === "number"
  );
}