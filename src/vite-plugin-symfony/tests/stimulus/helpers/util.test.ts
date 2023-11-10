import { describe, it } from "vitest";
import { getStimulusControllerFileInfos, generateStimulusId } from "../../../src/stimulus/helpers/util";

describe("stimulus", () => {
  it("getStimulusControllerFileInfos generate correct infos", ({ expect }) => {
    const list: [string, string | undefined, boolean][] = [
      ["./controllers/welcome_controller.js", "welcome", false],
      ["./controllers/welcome_lazycontroller.js", "welcome", true],

      ["./some-content-before/controllers/welcome_controller.js", "welcome", false],
      // without controllers
      ["../welcome_controller.js", "welcome", false],
      // some content after we add --
      ["./controllers/foo/bar_controller.js", "foo--bar", false],
      // we replace _ -> -
      ["./controllers/foo_bar_controller.js", "foo-bar", false],

      ["not a controller", undefined, false],
    ];
    list.forEach(([input, expectedIdentifier, expectedLazy]) => {
      const { identifier, lazy } = getStimulusControllerFileInfos(input);
      expect(identifier).toBe(expectedIdentifier);
      expect(lazy).toBe(expectedLazy);
    });
  });

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
