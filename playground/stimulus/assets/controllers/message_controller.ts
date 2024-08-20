import { Controller } from "@hotwired/stimulus"

export default class controller extends Controller {
  declare titleTarget: HTMLDivElement;
  declare nameValue: string;

  static targets = [
    "title",
  ]
  static values = {
    name: String,
  }
  connect() {
    this.titleTarget.textContent = `hello ${this.nameValue}`;
  }
}