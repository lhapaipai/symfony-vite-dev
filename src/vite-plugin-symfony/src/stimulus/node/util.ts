// Normalize the controller name: remove the initial @ and use Stimulus format
export function generateStimulusId(packageName: string) {
  if (packageName.startsWith("@")) {
    packageName = packageName.substring(1);
  }
  return packageName.replace(/_/g, "-").replace(/\//g, "--");
}
