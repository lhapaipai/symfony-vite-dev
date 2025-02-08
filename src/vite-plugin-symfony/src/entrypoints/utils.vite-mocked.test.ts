import { vi, describe, test, expect } from "vitest";
import { extractExtraEnvVars } from "./utils";

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
        "__FOO__": ""bar"",
        "import.meta.env.APP_ENV": ""prod"",
      }
    `);
  });

  test("explicitly defined env vars takes precedence", () => {
    const result = extractExtraEnvVars("development", "/my-project", ["APP_ENV"], {
      "import.meta.env.APP_ENV": '"PRIORITY"',
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "import.meta.env.APP_ENV": ""PRIORITY"",
      }
    `);
  });
});
