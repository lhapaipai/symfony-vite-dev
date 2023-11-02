interface Element {
  _ripple?: {
    enabled?: boolean;
    centered?: boolean;
    class?: string;
    circle?: boolean;
    touched?: boolean;
    isTouch?: boolean;
    showTimer?: number;
    showTimerCommit?: (() => void) | null;
  };
  dataset: DOMStringMap;
}
