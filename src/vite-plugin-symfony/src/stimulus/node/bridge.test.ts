import { describe, expect, it, vi } from "vitest";
import { createControllersModule, extractStimulusIdentifier, parseStimulusRequest, stimulusFetchRE } from "./bridge";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { VitePluginSymfonyStimulusOptions } from "~/types";
import { ResolvedConfig } from "vite";

const testDir = resolve(fileURLToPath(import.meta.url), "../../../../tests");

console.log("TEST DIR", testDir);

function loadControllerJson(filename: string) {
  return JSON.parse(readFileSync(resolve(testDir, `fixtures/${filename}`)).toString());
}

function getPackageJson(path: string) {
  return JSON.parse(readFileSync(resolve(testDir, `fixtures/modules/${path}`)).toString());
}

vi.mock("node:module", () => {
  const createRequire = () => vi.fn().mockImplementation(getPackageJson);
  return { createRequire };
});

const pluginDefaultOptions: VitePluginSymfonyStimulusOptions = {
  controllersDir: "./assets/controllers",
  controllersFilePath: "./assets.controllers.json",
  hmr: true,
  fetchMode: "eager",
  identifierResolutionMethod: "snakeCase",
};

function createControllersModuleFactory(config: any) {
  return createControllersModule(config, pluginDefaultOptions).trim();
}

describe("parseStimulusRequest", () => {
  it.each([
    [`import.meta.stimulusFetch="eager"`, true],
    [`      import.meta.stimulusFetch="eager"`, true],
    [
      `const foo = "bar"
      import.meta.stimulusFetch="eager"`,
      true,
    ],
    [`// import.meta.stimulusFetch="eager"`, false],
    [`/* import.meta.stimulusFetch="eager" */`, false],
    [`const foo = "bar"; /* import.meta.stimulusFetch="eager" */ const foo = "bar"; `, false],

    /**
     * to be improved
     * need to begin with the import. sorry if you have time to find a better regex, PR are welcome
     */
    [`const foo = "bar"; import.meta.stimulusFetch="eager"; const foo = "bar";`, false],
  ])("regex match import.meta %s", function (code, isMatching) {
    expect(stimulusFetchRE.test(code)).toBe(isMatching);
  });

  it.each([
    [`import.meta.stimulusIdentifier = "foo"`, "foo"],
    [``, null],
  ])("extract identifier %s from code or null", (code, result) => {
    expect(extractStimulusIdentifier(code)).toBe(result);
  });

  it("parse import.meta from source code", () => {
    const code = `
import { Controller } from "@hotwired/stimulus";

import.meta.stimulusEnabled = false;
import.meta.stimulusFetch = "eager";
import.meta.stimulusIdentifier = "other";

export default class controller extends Controller {}
    `;
    const path = "/path/to/project/assets/controllers/welcome_controller.js";
    const result = parseStimulusRequest(
      code,
      path,
      { fetchMode: "lazy", identifierResolutionMethod: "snakeCase" } as VitePluginSymfonyStimulusOptions,
      { root: "/path/to/project" } as ResolvedConfig,
    );

    expect(result).toMatchInlineSnapshot(`
      "
              import Controller from '/path/to/project/assets/controllers/welcome_controller.js';
              export default {
                enabled: false,
                fetch: 'eager',
                identifier: 'other',
                controller: Controller
              }
      if (import.meta.hot) { import.meta.hot.accept(); }"
    `);
  });

  it("not parse import.meta from source code when import.meta are in comments", () => {
    const code = `
import { Controller } from "@hotwired/stimulus";

// import.meta.stimulusEnabled = false;
// import.meta.stimulusFetch = "eager";
// import.meta.stimulusIdentifier = "other";

export default class controller extends Controller {}
    `;
    const path = "/path/to/project/assets/controllers/welcome_controller.js";
    const result = parseStimulusRequest(
      code,
      path,
      { fetchMode: "lazy", identifierResolutionMethod: "snakeCase" } as VitePluginSymfonyStimulusOptions,
      { root: "/path/to/project" } as ResolvedConfig,
    );

    expect(result).toMatchInlineSnapshot(`
      "
              export default {
                enabled: true,
                fetch: 'lazy',
                identifier: 'welcome',
                controller: () => import('/path/to/project/assets/controllers/welcome_controller.js')
              }
      if (import.meta.hot) { import.meta.hot.accept(); }"
    `);
  });
});

describe("createControllersModule", () => {
  describe("empty.json", () => {
    it("must return empty array", () => {
      const config = loadControllerJson("empty.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "export default [

        ];"
      `);
    });
  });

  describe("disabled-controller.json", () => {
    it("must return an empty array", () => {
      const config = loadControllerJson("disabled-controller.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "export default [

        ];"
      `);
    });
  });

  describe("disabled-autoimport.json", () => {
    it("must return controller info without autoimport", () => {
      const config = loadControllerJson("disabled-autoimport.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';

        export default [
        {
                enabled: true,
                fetch: "eager",
                identifier: "symfony--mock-module--mock",
                controller: controller_0
              }
        ];"
      `);
    });
  });

  describe("eager-no-autoimport.json", () => {
    it("must return controller info without autoimport", () => {
      const config = loadControllerJson("eager-no-autoimport.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';

        export default [
        {
                enabled: true,
                fetch: "eager",
                identifier: "symfony--mock-module--mock",
                controller: controller_0
              }
        ];"
      `);
    });
  });

  describe("eager-autoimport.json", () => {
    it("must return a controller info with the controller constructor and auto-import", () => {
      const config = loadControllerJson("eager-autoimport.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';
        import '@symfony/mock-module/dist/style.css';

        export default [
        {
                enabled: true,
                fetch: "eager",
                identifier: "symfony--mock-module--mock",
                controller: controller_0
              }
        ];"
      `);
    });
  });

  describe("lazy-no-autoimport.json", () => {
    it("must return a controller info with a controller factory", () => {
      const config = loadControllerJson("lazy-no-autoimport.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "export default [
        {
                enabled: true,
                fetch: "lazy",
                identifier: "symfony--mock-module--mock",
                controller: () => import("@symfony/mock-module/dist/controller.js")
              }
        ];"
      `);
    });
  });

  describe("load-named-controller.json", () => {
    it("must register the custom name from package's package.json", () => {
      const config = loadControllerJson("load-named-controller.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/named_controller.js';

        export default [
        {
                enabled: true,
                fetch: "eager",
                identifier: "foo--custom_name",
                controller: controller_0
              }
        ];"
      `);
    });
  });

  describe("override-name.json", () => {
    it('must use the overridden "name" from user\'s config', () => {
      const config = loadControllerJson("override-name.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';

        export default [
        {
                enabled: true,
                fetch: "eager",
                identifier: "foo--overridden_name",
                controller: controller_0
              }
        ];"
      `);
    });
  });

  describe("third-party.json", () => {
    it("can import stimulus controller without symfony property", () => {
      const config = loadControllerJson("third-party.json");
      expect(createControllersModuleFactory(config)).toMatchInlineSnapshot(`
        "import controller_0 from 'stimulus-clipboard/dist/stimulus-clipboard.mjs';

        export default [
        {
                enabled: true,
                fetch: "eager",
                identifier: "stimulus-clipboard",
                controller: controller_0
              }
        ];"
      `);
    });
  });
});
