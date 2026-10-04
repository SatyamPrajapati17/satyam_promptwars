export type ErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "validation_failed"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "integration_not_configured"
  | "ai_failed"
  | "ai_invalid_output"
  | "internal";

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

