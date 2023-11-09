export function identifierFromFilePath(key: string): string | undefined {
  const extract = (key.match(CONTROLLER_FILENAME_REGEX) || [])[1];
  if (extract) return extract.replace(/_/g, "-").replace(/\//g, "--");
}

// Normalize the controller name: remove the initial @ and use Stimulus format
export function generateStimulusId(packageName: string) {
  if (packageName.startsWith("@")) {
    packageName = packageName.substring(1);
  }
  return packageName.replace(/_/g, "-").replace(/\//g, "--");
}

export const CONTROLLER_FILENAME_REGEX = /^(?:.*?(?:controllers)\/|\.?\.\/)?(.+)(?:[/_-]controller\.[jt]sx?)$/;
