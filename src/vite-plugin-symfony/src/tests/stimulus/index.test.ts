import { describe, it } from "vitest";
import { generateStimulusId } from "../../stimulusBridge";
import { identifierFromFilePath } from "../../stimulus-helpers/util";

describe("stimulus", () => {
  it("identifierFromFilePath generate correct identifier", ({ expect }) => {
    const list = [
      ["./controllers/welcome_controller.js", "welcome"],
      ["./some-content-before/controllers/welcome_controller.js", "welcome"],
      // without controllers
      ["../welcome_controller.js", "welcome"],
      // some content after we add --
      ["./controllers/foo/bar_controller.js", "foo--bar"],
      // we replace _ -> -
      ["./controllers/foo_bar_controller.js", "foo-bar"],

      ["not a controller", undefined],
    ];
    list.forEach(([input, result]) => {
      expect(identifierFromFilePath(input)).toBe(result);
    });
  });

  it("identifierFromThirdParty generate correct identifier", ({ expect }) => {
    const list = [
      ["@symfony/ux-toggle-password/toggle-password", "symfony--ux-toggle-password--toggle-password"],

      // ["not a controller", undefined],
    ];
    list.forEach(([input, result]) => {
      expect(generateStimulusId(input)).toBe(result);
    });
  });
});
