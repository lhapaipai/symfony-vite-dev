export const CONTROLLER_FILENAME_REGEX = /^(?:.*?(?:controllers)\/|\.?\.\/)?(.+)(?:[/_-](lazy)?controller\.[jt]sx?)$/;

export function getStimulusControllerFileInfos(key: string): StimulusControllerFileInfos {
  const [, identifier, lazy] = key.match(CONTROLLER_FILENAME_REGEX) || [];

  return {
    identifier: identifier ? identifier.replace(/_/g, "-").replace(/\//g, "--") : undefined,
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
