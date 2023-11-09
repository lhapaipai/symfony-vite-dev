import { Controller } from "@hotwired/stimulus"

export default class controller extends Controller {
  static values = {
    name: String
  }
  connect() {
    this.element.textContent = `hello ${this.nameValue}`;
  }
}