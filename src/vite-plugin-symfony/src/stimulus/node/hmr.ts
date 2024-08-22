import { Logger } from "vite";

const applicationGlobalVarName = "$$stimulusApp$$";

export function addBootstrapHmrCode(code: string, logger: Logger) {
  /**
   * const app = startStimulusApp();
   * matchArray = ["const app = startStimulusApp()", "app"]
   */
  const appRegex = /[^\n]*?\s(\w+)(?:\s*=\s*startStimulusApp\(\))/;
  const appVariable = (code.match(appRegex) || [])[1];
  if (appVariable) {
    logger.info(`stimulus app available globally for HMR with window.${applicationGlobalVarName}`);
    const exportFooter = `window.${applicationGlobalVarName} = ${appVariable}`;
    return `${code}\n${exportFooter}`;
  }
  return null;
}

export function addControllerHmrCode(code: string, identifier: string) {
  // we don't need lazy behavior, the module is already loaded and we are in a dev environment
  // TODO explain comment

  const metaHotFooter = `
if (import.meta.hot) {
  import.meta.hot.accept(newModule => {
    if (!window.${applicationGlobalVarName}) {
      console.warn('Stimulus app not available. Are you creating app with startStimulusApp() ?');
      import.meta.hot.invalidate();
    } else {
      window.${applicationGlobalVarName}.register('${identifier}', newModule.default);
    }
  })
}`;

  return `${code}\n${metaHotFooter}`;
}
