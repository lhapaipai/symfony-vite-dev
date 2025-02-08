import { describe, it } from "vitest";
import { getDevEntryPoints } from "./entryPointsHelper";

import type { ResolvedConfig } from "vite";
import { viteBaseConfig } from "~tests/mocks";

describe("getDevEntryPoints", () => {
  it("generate correct entrypoints", ({ expect }) => {
    expect(
      getDevEntryPoints(
        {
          ...viteBaseConfig,
          build: {
            rollupOptions: {
              input: {
                app: "./path/to/filename.ts",
                theme: "./other/place/to/theme.scss",
              },
            },
          },
        } as unknown as ResolvedConfig,
        "http://localhost:5173",
      ),
    ).toMatchInlineSnapshot(`
      {
        "app": {
          "js": [
            "http://localhost:5173/build/path/to/filename.ts",
          ],
        },
        "theme": {
          "css": [
            "http://localhost:5173/build/other/place/to/theme.scss",
          ],
        },
      }
    `);
  });
});
