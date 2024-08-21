import { Controller } from "@hotwired/stimulus";

import.meta.stimulusFetch = "eager";
import.meta.stimulusIdentifier = "other";

export default class controller extends Controller {
  declare titleTarget: HTMLDivElement;
  declare nameValue: string;

  static targets = ["title"];
  static values = {
    name: String,
  };
  connect() {
    this.titleTarget.textContent = `other ${this.nameValue}`;
  }
}
