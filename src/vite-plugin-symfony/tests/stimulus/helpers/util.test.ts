import { describe, it, expect } from "vitest";
import { getStimulusControllerFileInfos } from "../../../src/stimulus/helpers/util";

describe("stimulus", () => {
  it.each([
    {
      input: "./controllers/welcome_controller.js",
      onlyControllersDir: false,
      expectedId: "welcome",
      expectedLazy: false,
    },
    {
      input: "./controllers/welcome_lazycontroller.js",
      onlyControllersDir: false,
      expectedId: "welcome",
      expectedLazy: true,
    },
    {
      input: "./some-content-before/controllers/welcome_controller.js",
      onlyControllersDir: false,
      expectedId: "welcome",
      expectedLazy: false,
    },
    // without controllers
    { input: "../welcome_controller.js", onlyControllersDir: false, expectedId: "welcome", expectedLazy: false },
    // bare module
    {
      input: "library/welcome_controller.js",
      onlyControllersDir: false,
      expectedId: "library--welcome",
      expectedLazy: false,
    },
    // some content after we add --
    {
      input: "./controllers/foo/bar_controller.js",
      onlyControllersDir: false,
      expectedId: "foo--bar",
      expectedLazy: false,
    },
    // we replace _ -> -
    {
      input: "./controllers/foo_bar_controller.js",
      onlyControllersDir: false,
      expectedId: "foo-bar",
      expectedLazy: false,
    },
    { input: "./controllers/my_module.js", onlyControllersDir: false, expectedId: "my-module", expectedLazy: false },
    { input: "./path/to/file.js", onlyControllersDir: false, expectedId: "path--to--file", expectedLazy: false },
    { input: "not a controller", onlyControllersDir: false, expectedId: undefined, expectedLazy: false },
    {
      input: "/home/lhapaipai/projets/symfony-vite-dev/playground/stimulus/assets/app.js",
      onlyControllersDir: true,
      expectedId: undefined,
      expectedLazy: false,
    },
  ])(
    "getStimulusControllerFileInfos generate correct infos",
    ({ input, onlyControllersDir, expectedId, expectedLazy }) => {
      const { identifier, lazy } = getStimulusControllerFileInfos(input, onlyControllersDir);
      expect(identifier).toBe(expectedId);
      expect(lazy).toBe(expectedLazy);
    },
  );
});
