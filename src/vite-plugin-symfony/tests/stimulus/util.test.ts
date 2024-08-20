import { describe, it, expect } from "vitest";
import { getStimulusControllerId, generateStimulusId } from "~/stimulus/util";

describe("stimulus generateStimulusId", () => {
  it("identifierFromThirdParty generate correct identifier", ({ expect }) => {
    const list = [
      ["@symfony/ux-toggle-password/toggle-password", "symfony--ux-toggle-password--toggle-password"],
      ["my-custom-package/toggle-password", "my-custom-package--toggle-password"],
    ];
    list.forEach(([input, result]) => {
      expect(generateStimulusId(input)).toBe(result);
    });
  });
});

describe("stimulus getStimulusControllerId", () => {
  it.each([
    {
      input: "./controllers/welcome_controller.js",
      onlyControllersDir: false,
      expectedId: "welcome",
    },
    {
      input: "./controllers/Welcome.js",
      onlyControllersDir: false,
      expectedId: "welcome",
    },
    {
      input: "./some-content-before/controllers/welcome_controller.js",
      onlyControllersDir: false,
      expectedId: "welcome",
    },
    // without controllers
    { input: "../welcome_controller.js", onlyControllersDir: false, expectedId: "welcome" },
    // bare module
    {
      input: "library/welcome_controller.js",
      onlyControllersDir: false,
      expectedId: "library--welcome",
    },
    // some content after we add --
    {
      input: "./controllers/foo/bar_controller.js",
      onlyControllersDir: false,
      expectedId: "foo--bar",
    },
    // we replace _ -> -
    {
      input: "./controllers/foo_bar_controller.js",
      onlyControllersDir: false,
      expectedId: "foo-bar",
    },
    { input: "./controllers/my_module.js", onlyControllersDir: false, expectedId: "my-module" },
    { input: "./path/to/file.js", onlyControllersDir: false, expectedId: "path--to--file" },
    { input: "not a controller", onlyControllersDir: false, expectedId: null },
    {
      input: "/home/lhapaipai/projets/symfony-vite-dev/playground/stimulus/assets/app.js",
      onlyControllersDir: true,
      expectedId: null,
    },
  ])("getStimulusControllerId generate correct infos", ({ input, onlyControllersDir, expectedId }) => {
    const identifier = getStimulusControllerId(input, onlyControllersDir);
    expect(identifier).toBe(expectedId);
  });
});
