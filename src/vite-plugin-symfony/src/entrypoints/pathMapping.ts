import { StringMapping } from "~/types";

const inputRelPath2outputRelPath: StringMapping = {};

export function addIOMapping(relInputPath: string, relOutputPath: string) {
  inputRelPath2outputRelPath[relInputPath] = relOutputPath;
}

export function getOutputPath(relInputPath: string): string | undefined {
  return inputRelPath2outputRelPath[relInputPath];
}

export function getInputPath(relOutputPath: string): string | undefined {
  return Object.keys(inputRelPath2outputRelPath).find((key) => inputRelPath2outputRelPath[key] === relOutputPath);
}
