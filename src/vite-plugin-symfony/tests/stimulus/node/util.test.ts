import { describe, it } from "vitest";
import { generateStimulusId } from "../../../src/stimulus/node/util";

describe("stimulus", () => {
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
