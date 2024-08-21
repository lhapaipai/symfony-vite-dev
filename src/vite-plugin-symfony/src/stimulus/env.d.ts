type LazyLoadedStimulusControllerModule = () => Promise<{
  default: import("@hotwired/stimulus").ControllerConstructor;
}>;

type StimulusControllerInfos =
  | {
      identifier: string;
      enabled: boolean;
      fetch: "lazy";
      controller: LazyLoadedStimulusControllerModule;
    }
  | {
      identifier: string;
      enabled: boolean;
      fetch: "eager";
      controller: import("@hotwired/stimulus").ControllerConstructor;
    };
type StimulusControllerInfosImport = {
  default: StimulusControllerInfos;
  [Symbol.toStringTag]: "Module";
};
declare module "virtual:symfony/controllers" {
  const defaultExport: StimulusControllerInfos[];
  export default defaultExport;
}

interface ImportMeta {
  stimulusFetch: "lazy" | "eager";
  stimulusIdentifier: string;
  stimulusEnabled: boolean;
}

declare module "*?stimulus" {
  const defaultExport: StimulusControllerInfos;
  export default defaultExport;
}
