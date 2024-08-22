import { VitePluginSymfonyStimulusOptions } from "~/types";

export const CONTROLLER_FILENAME_REGEX = /^(?:.*?controllers\/|\.?\.\/)?(.+)\.[jt]sx?\b/;
export const SNAKE_CONTROLLER_SUFFIX_REGEX = /^(.*)(?:[/_-]controller)$/;
export const CAMEL_CONTROLLER_SUFFIX_REGEX = /^(.*)(?:Controller)$/;
export function getStimulusControllerId(
  key: string,
  identifierResolutionMethod: VitePluginSymfonyStimulusOptions["identifierResolutionMethod"],
): string | null {
  if (typeof identifierResolutionMethod === "function") {
    return identifierResolutionMethod(key);
  }

  const [, relativePath] = key.match(CONTROLLER_FILENAME_REGEX) || [];
  if (!relativePath) {
    return null;
  }

  if (identifierResolutionMethod === "snakeCase") {
    const [, identifier] = relativePath.match(SNAKE_CONTROLLER_SUFFIX_REGEX) || [];
    return (identifier ?? relativePath).toLowerCase().replace(/_/g, "-").replace(/\//g, "--");
  } else if (identifierResolutionMethod === "camelCase") {
    const [, identifier] = relativePath.match(CAMEL_CONTROLLER_SUFFIX_REGEX) || [];
    return kebabize(identifier ?? relativePath);
  }
  throw new Error("unknown identifierResolutionMethod valid entries 'snakeCase' or 'camelCase' or custom function");
}

// Normalize the controller identifier from `${packageName}/${controllerName}`
// remove the initial @ and use Stimulus format
export function generateStimulusId(packageName: string) {
  if (packageName.startsWith("@")) {
    packageName = packageName.substring(1);
  }
  return packageName.replace(/_/g, "-").replace(/\//g, "--");
}

function kebabize(str: string): string {
  return str
    .split("")
    .map((letter, idx) => {
      if (letter === "/") {
        return "--";
      }
      return letter.toUpperCase() === letter
        ? `${idx !== 0 && str[idx - 1] !== "/" ? "-" : ""}${letter.toLowerCase()}`
        : letter;
    })
    .join("");
}
