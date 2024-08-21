import { describe, it, expect } from "vitest";
import { getImportRE, objectToArg } from "~/fos-routing/utils";

describe("symfonyFosRouting Utility Functions", () => {
  describe("objectToArg", () => {
    it("should transform an object into an array of shell arguments", () => {
      const obj = {
        key: "value",
        anotherKey: 123,
        flag: true,
        falseFlag: false,
      };
      const result = objectToArg(obj);
      expect(result).toEqual(["--key=value", "--another-key=123", "--flag"]);
    });

    it("should handle nested objects with extraArgs key", () => {
      const obj = {
        key: "value",
        extraArgs: {
          nestedKey: "nestedValue",
          anotherNestedKey: 456,
        },
      };
      const result = objectToArg(obj);
      expect(result).toEqual(["--key=value", "--nested-key=nestedValue", "--another-nested-key=456"]);
    });

    it("should handle arrays in the object", () => {
      const obj = {
        key: ["value1", "value2"],
        anotherKey: 123,
      };
      const result = objectToArg(obj);
      expect(result).toEqual(["--key=value1", "--key=value2", "--another-key=123"]);
    });

    it.each([
      [`import Routing from 'fos-router';`, "fos-router", true],
      [`import Routing from "fos-router";`, "fos-router", true],
      [`import Routing from 'fos-router'`, "fos-router", true],
      [`import Routing from "fos-router"`, "fos-router", true],
      [`  import    othEr01    from  'symfony-ts-router';`, "symfony-ts-router", true],
      [`  import Routing from "symfony-ts-router"\n`, "symfony-ts-router", true],
      [`import Routing from "@namespace/other"`, "@namespace/other", true],
      [`import Routing from 'other"`, "other", false],
    ])("should detect if there is an import of the Routing package", async (code, packageName, isMatching) => {
      const regex = getImportRE(packageName);
      expect(regex.test(code)).toBe(isMatching);
    });
  });
});
