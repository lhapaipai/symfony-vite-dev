import { describe, it, vi } from "vitest";
import { isSubdirectory } from "../src/utils";

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
