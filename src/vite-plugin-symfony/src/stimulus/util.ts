export const CONTROLLER_FILENAME_REGEX = /^(?:.*?(controllers)\/|\.?\.\/)?(.+)\.[jt]sx?$/;
export const CONTROLLER_SUFFIX_REGEX = /^(.*)(?:[/_-](lazy)?controller)$/;
export function getStimulusControllerFileInfos(key: string, onlyControllersDir = false): StimulusControllerFileInfos {
  const [, controllers, relativePath] = key.match(CONTROLLER_FILENAME_REGEX) || [];
  if (!relativePath || (onlyControllersDir && controllers !== "controllers")) {
    return {
      identifier: undefined,
      lazy: false,
    };
  }

  const [, identifier, lazy] = relativePath.match(CONTROLLER_SUFFIX_REGEX) || [];

  return {
    identifier: (identifier ?? relativePath).replace(/_/g, "-").replace(/\//g, "--"),
    lazy: lazy === "lazy",
  };
}

// Normalize the controller name: remove the initial @ and use Stimulus format
export function generateStimulusId(packageName: string) {
  if (packageName.startsWith("@")) {
    packageName = packageName.substring(1);
  }
  return packageName.replace(/_/g, "-").replace(/\//g, "--");
}
