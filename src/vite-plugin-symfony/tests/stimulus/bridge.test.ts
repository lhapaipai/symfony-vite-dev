import { describe, expect, it, vi } from "vitest";
import { createControllersModule } from "../../src/stimulus/bridge";

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(dirname(fileURLToPath(import.meta.url)));

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
    it("must return empty file", () => {
      const config = loadControllerJson("empty.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "export default {

        };"
      `);
    });
  });

  describe("disabled-controller.json", () => {
    it("must return an empty file", () => {
      const config = loadControllerJson("disabled-controller.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "export default {

        };"
      `);
    });
  });

  describe("disabled-autoimport.json", () => {
    it("must return file with no autoimport", () => {
      const config = loadControllerJson("disabled-autoimport.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';

        export default {
        'symfony--mock-module--mock': controller_0
        };"
      `);
    });
  });

  describe("eager-no-autoimport.json", () => {
    it("must return file with no autoimport", () => {
      const config = loadControllerJson("eager-no-autoimport.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';

        export default {
        'symfony--mock-module--mock': controller_0
        };"
      `);
    });
  });

  describe("eager-autoimport.json", () => {
    it("must return a file with the enabled controller and auto-import", () => {
      const config = loadControllerJson("eager-autoimport.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';
        import '@symfony/mock-module/dist/style.css';

        export default {
        'symfony--mock-module--mock': controller_0
        };"
      `);
    });
  });

  describe("lazy-no-autoimport.json", () => {
    it("must return a file with a lazy controller", () => {
      const config = loadControllerJson("lazy-no-autoimport.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "import { Controller } from '@hotwired/stimulus';

        export default {
        'symfony--mock-module--mock': class extends Controller {
              constructor(context) {
                  super(context);
                  this.__stimulusLazyController = true;
              }
              initialize() {
                  if (this.application.controllers.find((controller) => {
                      return controller.identifier === this.identifier && controller.__stimulusLazyController;
                  })) {
                      return;
                  }
                  import('@symfony/mock-module/dist/controller.js').then((controller) => {
                      this.application.register(this.identifier, controller.default);
                  });
              }
          }
        };"
      `);
    });
  });

  describe("load-named-controller.json", () => {
    it("must register the custom name from package's package.json", () => {
      const config = loadControllerJson("load-named-controller.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/named_controller.js';

        export default {
        'foo--custom_name': controller_0
        };"
      `);
    });
  });

  describe("override-name.json", () => {
    it('must use the overridden "name" from user\'s config', () => {
      const config = loadControllerJson("override-name.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "import controller_0 from '@symfony/mock-module/dist/controller.js';

        export default {
        'foo--overridden_name': controller_0
        };"
      `);
    });
  });

  describe("third-party.json", () => {
    it("can import stimulus controller without symfony property", () => {
      const config = loadControllerJson("third-party.json");
      expect(createControllersModule(config).trim()).toMatchInlineSnapshot(`
        "import controller_0 from 'stimulus-clipboard';

        export default {
        'stimulus-clipboard': controller_0
        };"
      `);
    });
  });
});
