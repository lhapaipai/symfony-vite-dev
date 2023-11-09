import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    name: String
  }
  initialize() {
    console.log("initialize", this, this.application.controllers)
  }
  connect() {
    console.log('connect welcome_controller', this)
    this.element.textContent = `hello ${this.nameValue}`;
  }
}