import { describe, expect, it, vi } from "vitest";
import { createControllersModule } from "~/stimulus/node/bridge";

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

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

describe("createControllersModule", () => {
  describe("empty.json", () => {
    it("must return empty array", () => {
      const config = loadControllerJson("empty.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "export default [

        ];"
      `);
    });
  });

  describe("disabled-controller.json", () => {
    it("must return an empty array", () => {
      const config = loadControllerJson("disabled-controller.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "export default [

        ];"
      `);
    });
  });

  describe("disabled-autoimport.json", () => {
    it("must return controller info without autoimport", () => {
      const config = loadControllerJson("disabled-autoimport.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
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
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
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
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
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
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
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
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
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
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
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
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
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
