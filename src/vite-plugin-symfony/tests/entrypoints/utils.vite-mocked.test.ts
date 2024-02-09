import { vi, describe, test, expect } from "vitest";
import { extractExtraEnvVars } from "~/entrypoints/utils";

vi.mock("vite", async (original) => {
  return {
    ...(await original<typeof import("vite")>()),
    loadEnv: vi.fn(() => ({
      APP_ENV: "prod",
      APP_SECRET: "I don't want to be exposed !!",
    })),
  };
});

describe("extractExtraEnvVars()", () => {
  test("extract Only Exposed Env vars and explicitly defined", () => {
    const result = extractExtraEnvVars("development", "/my-project", ["APP_ENV"], { __FOO__: '"bar"' });
    expect(result).toMatchInlineSnapshot(`
      {
        "APP_ENV": ""prod"",
        "__FOO__": ""bar"",
      }
    `);
  });

  test("explicitly defined env vars takes precedence", () => {
    const result = extractExtraEnvVars("development", "/my-project", ["APP_ENV"], { APP_ENV: '"PRIORITY"' });
    expect(result).toMatchInlineSnapshot(`
      {
        "APP_ENV": ""PRIORITY"",
      }
    `);
  });
});
