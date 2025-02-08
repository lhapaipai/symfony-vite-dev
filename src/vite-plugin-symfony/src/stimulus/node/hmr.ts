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
  const metaHotFooter = `
if (import.meta.hot) {
  import.meta.hot.accept(newModule => {
    if (!window.${applicationGlobalVarName}) {
      console.warn('Stimulus app not available. Are you creating app with startStimulusApp() ?');
      import.meta.hot.invalidate();
    } else {
      if (window.${applicationGlobalVarName}.router.modulesByIdentifier.has('${identifier}') && newModule.default) {
        window.${applicationGlobalVarName}.register('${identifier}', newModule.default);
      } else {
        console.warn('Try to HMR not registered Stimulus controller', '${identifier}', 'full-reload');
        import.meta.hot.invalidate();
      }
    }
  })
}`;

  return `${code}\n${metaHotFooter}`;
}
