import { describe, it, vi } from "vitest";
import { isSubdirectory, normalizePath } from "./utils";

vi.mock("node:path", async () => {
  const win32Path = await vi.importActual<typeof import("node:path/win32")>("node:path/win32");
  return win32Path;
});

vi.mock("node:process", async () => {
  const originalProcess = await vi.importActual<typeof import("node:process")>("node:process");
  return {
    ...originalProcess,
    platform: "win32",
  };
});

vi.mock("node:os", async () => {
  const originalOs = await vi.importActual<typeof import("node:os") & { default: any }>("node:os");
  return {
    ...originalOs,
    default: {
      ...originalOs.default,
      platform: () => "win32",
    },
  };
});

describe("Windows: normalizePath", () => {
  it("change the path on windows", ({ expect }) => {
    expect(normalizePath("path\\to\\asset.svg")).toBe("path/to/asset.svg");
  });
});

describe("Windows: isAncestorDir", () => {
  it("Windows: subdirectory is a subdirectory", ({ expect }) => {
    expect(isSubdirectory("C:\\projects", "C:\\projects\\vite-project")).toBe(true);
  });
  it("Windows: different directory is not a subdirectory", ({ expect }) => {
    expect(isSubdirectory("C:\\projects", "C:\\Users")).toBe(false);
  });
  it("Windows: subdirectory on another drive is not a subdirectory", ({ expect }) => {
    expect(isSubdirectory("C:\\projects", "D:\\projects\\svelte-project")).toBe(false);
  });
});
