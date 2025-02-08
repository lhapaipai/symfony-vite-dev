/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import { registerVueControllerComponents } from "./index";
import { ImportedModules } from "../types";
import { VueModule } from "./types";

const fakeVueComponent = () => ({});

const createFakeImportedModules = () => {
  return {
    "./vue/controllers/Hello.vue": () => Promise.resolve(fakeVueComponent),
  } as any as ImportedModules<VueModule>;
};

describe("registerVueControllerComponents", () => {
  it("should resolve components", () => {
    registerVueControllerComponents(createFakeImportedModules());
    const resolveVueComponent = window.resolveVueComponent;

    expect(resolveVueComponent).not.toBeUndefined();
    expect(resolveVueComponent("Hello")).toMatchInlineSnapshot(`
      {
        "__asyncHydrate": [Function],
        "__asyncLoader": [Function],
        "__asyncResolved": undefined,
        "name": "AsyncComponentWrapper",
        "setup": [Function],
      }
    `);
  });

  it("errors with a bad name", () => {
    registerVueControllerComponents(createFakeImportedModules());
    const resolveVueComponent = window.resolveVueComponent;
    expect(() => resolveVueComponent("Helloooo")).toThrowErrorMatchingInlineSnapshot(
      `[Error: Vue controller "Helloooo" does not exist. Possible values: vue/controllers/Hello]`,
    );
  });
});
