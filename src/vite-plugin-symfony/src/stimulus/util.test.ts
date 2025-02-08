import { describe, it, expect } from "vitest";
import { getStimulusControllerId, generateStimulusId } from "./util";

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
      expectedId: "welcome",
    },
    {
      input: "./controllers/Welcome.js",
      expectedId: "welcome",
    },
    {
      input: "./some-content-before/controllers/welcome_controller.js",
      expectedId: "welcome",
    },
    {
      input: "/path/to/project/assets/controllers/welcome_controller.js",
      expectedId: "welcome",
    },
    // without controllers
    { input: "../welcome_controller.js", expectedId: "welcome" },
    // bare module
    {
      input: "library/welcome_controller.js",
      expectedId: "library--welcome",
    },
    {
      // ./ is removed from computation
      input: "./library/welcome_controller.js",
      expectedId: "library--welcome",
    },
    // some content after we add --
    {
      input: "./controllers/foo/bar_controller.js",
      expectedId: "foo--bar",
    },
    // we replace _ -> -
    {
      input: "./controllers/foo_bar_controller.js",
      expectedId: "foo-bar",
    },
    { input: "./controllers/my_module.js", expectedId: "my-module" },
    { input: "./path/to/file.js", expectedId: "path--to--file" },
    { input: "not a controller", expectedId: null },
  ])("getStimulusControllerId generate correct infos with snakecase resolution method", ({ input, expectedId }) => {
    const identifier = getStimulusControllerId(input, "snakeCase");
    expect(identifier).toBe(expectedId);
  });

  it.each([
    {
      input: "./controllers/WelcomeController.js",
      expectedId: "welcome",
    },
    {
      input: "./controllers/Welcome.js",
      expectedId: "welcome",
    },
    {
      input: "./some-content-before/controllers/WelcomeController.js",
      expectedId: "welcome",
    },
    // without controllers
    { input: "../WelcomeController.js", expectedId: "welcome" },
    // bare module
    {
      input: "library/WelcomeController.js",
      expectedId: "library--welcome",
    },
    {
      input: "./library/WelcomeController.js",
      expectedId: "library--welcome",
    },
    {
      input: "./controllers/foo/BarController.js",
      expectedId: "foo--bar",
    },
    {
      input: "./controllers/FooBarController.js",
      expectedId: "foo-bar",
    },
    { input: "./controllers/MyModule.js", expectedId: "my-module" },
    { input: "./path/to/file.js", expectedId: "path--to--file" },
    { input: "not a controller", expectedId: null },
  ])("getStimulusControllerId generate correct infos with camelCase resolution method", ({ input, expectedId }) => {
    const identifier = getStimulusControllerId(input, "camelCase");
    expect(identifier).toBe(expectedId);
  });
});
