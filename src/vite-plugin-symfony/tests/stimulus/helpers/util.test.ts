import { describe, it, expect } from "vitest";
import { getStimulusControllerFileInfos } from "../../../src/stimulus/helpers/util";

describe("stimulus", () => {
  it.each([
    { input: "./controllers/welcome_controller.js", expectedId: "welcome", expectedLazy: false },
    { input: "./controllers/welcome_lazycontroller.js", expectedId: "welcome", expectedLazy: true },
    {
      input: "./some-content-before/controllers/welcome_controller.js",
      expectedId: "welcome",
      expectedLazy: false,
    },
    // without controllers
    { input: "../welcome_controller.js", expectedId: "welcome", expectedLazy: false },
    // bare module
    { input: "library/welcome_controller.js", expectedId: "library--welcome", expectedLazy: false },
    // some content after we add --
    { input: "./controllers/foo/bar_controller.js", expectedId: "foo--bar", expectedLazy: false },
    // we replace _ -> -
    { input: "./controllers/foo_bar_controller.js", expectedId: "foo-bar", expectedLazy: false },
    { input: "./controllers/my_module.js", expectedId: "my-module", expectedLazy: false },
    { input: "./path/to/file.js", expectedId: "path--to--file", expectedLazy: false },
    { input: "not a controller", expectedId: undefined, expectedLazy: false },
  ])("getStimulusControllerFileInfos generate correct infos", ({ input, expectedId, expectedLazy }) => {
    const { identifier, lazy } = getStimulusControllerFileInfos(input);
    expect(identifier).toBe(expectedId);
    expect(lazy).toBe(expectedLazy);
  });
});
