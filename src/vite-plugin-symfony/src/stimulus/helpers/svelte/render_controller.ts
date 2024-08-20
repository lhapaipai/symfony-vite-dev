import { Controller } from "@hotwired/stimulus";
import { SvelteComponent } from "svelte";
import { SvelteModule } from "./types";

export default class extends Controller<Element & { root?: SvelteComponent }> {
  private app: SvelteComponent | undefined;
  declare readonly componentValue: string;

  private props: Record<string, any> | undefined;
  private intro: boolean | undefined;

  declare readonly propsValue: Record<string, unknown> | null | undefined;
  declare readonly introValue: boolean | undefined;

  static values = {
    component: String,
    props: Object,
    intro: Boolean,
  };

  connect() {
    this.element.innerHTML = "";

    this.props = this.propsValue ?? undefined;
    this.intro = this.introValue ?? undefined;

    this.dispatchEvent("connect");

    const importedSvelteModule = window.resolveSvelteComponent(this.componentValue);

    const onload = (svelteModule: SvelteModule) => {
      const Component = svelteModule.default;

      this._destroyIfExists();

      // @ts-expect-error @see https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component
      this.app = new Component({
        target: this.element,
        props: this.props,
        intro: this.intro,
      });

      this.element.root = this.app;

      this.dispatchEvent("mount", {
        component: Component,
      });
    };

    if (typeof importedSvelteModule === "function") {
      importedSvelteModule().then(onload);
    } else {
      onload(importedSvelteModule);
    }
  }

  disconnect() {
    this._destroyIfExists();
    this.dispatchEvent("unmount");
  }

  _destroyIfExists() {
    if (this.element.root !== undefined) {
      this.element.root.$destroy();
      delete this.element.root;
    }
  }

  private dispatchEvent(name: string, payload: object = {}) {
    const detail = {
      componentName: this.componentValue,
      props: this.props,
      intro: this.intro,
      ...payload,
    };
    this.dispatch(name, { detail, prefix: "svelte" });
  }
}
