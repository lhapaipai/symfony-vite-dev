import type { ComponentClass, FunctionComponent } from "react";
export type ReactComponent = string | FunctionComponent<object> | ComponentClass<object, any>;
export type ReactModule = {
  default: ReactComponent;
};
