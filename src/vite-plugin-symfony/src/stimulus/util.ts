export const CONTROLLER_FILENAME_REGEX = /^(?:.*?(controllers)\/|\.?\.\/)?(.+)\.[jt]sx?$/;
export const CONTROLLER_SUFFIX_REGEX = /^(.*)(?:[/_-]controller)$/;
export function getStimulusControllerId(key: string, onlyControllersDir = false): string | null {
  const [, controllers, relativePath] = key.match(CONTROLLER_FILENAME_REGEX) || [];
  if (!relativePath || (onlyControllersDir && controllers !== "controllers")) {
    return null;
  }

  const [, identifier] = relativePath.match(CONTROLLER_SUFFIX_REGEX) || [];

  return (identifier ?? relativePath).toLowerCase().replace(/_/g, "-").replace(/\//g, "--");
}

// Normalize the controller name: remove the initial @ and use Stimulus format
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
      return letter.toUpperCase() === letter ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}` : letter;
    })
    .join("");
}
