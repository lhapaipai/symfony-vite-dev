import { resolve, sep } from "node:path";

export function isPathIncluded(basePath: string, targetPath: string): boolean {
  const normalizedBasePath = resolve(basePath);
  const normalizedTargetPath = resolve(targetPath);

  const basePathWithSep = normalizedBasePath.endsWith(sep) ? normalizedBasePath : normalizedBasePath + sep;

  return normalizedTargetPath.startsWith(basePathWithSep);
}
