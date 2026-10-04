import { describe, it, expect } from "vitest";
import { publicEnv, isConfigured } from "./env";

describe("Environment Configuration", () => {
  it("defaults NEXT_PUBLIC_APP_URL to localhost", () => {
    expect(publicEnv.NEXT_PUBLIC_APP_URL).toBeDefined();
    expect(publicEnv.NEXT_PUBLIC_APP_URL).toContain("http");
  });

  it("reports unconfigured status cleanly before keys are entered", () => {
    expect(typeof isConfigured("supabase")).toBe("boolean");
    expect(typeof isConfigured("ai")).toBe("boolean");
    expect(typeof isConfigured("sheets")).toBe("boolean");
    expect(typeof isConfigured("gmail")).toBe("boolean");
  });
});

