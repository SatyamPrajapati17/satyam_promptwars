import { NextResponse } from "next/server";
import { ApiError, type ErrorCode } from "./errors";

export type Ok<T> = { ok: true; data: T };
export type Err = {
  ok: false;
  error: { code: ErrorCode; message: string; details?: unknown };
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<Ok<T>>({ ok: true, data }, { status });
}

export function err(
  code: ErrorCode,
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json<Err>(
    {
      ok: false,
      error: { code, message, details },
    },
    { status }
  );
}

export function handleApiError(e: unknown) {
  if (e instanceof ApiError) {
    return err(e.code, e.message, e.status, e.details);
  }
  const message = e instanceof Error ? e.message : "An unexpected error occurred";
  console.error("[API_ERROR]", e);
  return err("internal", message, 500);
}

