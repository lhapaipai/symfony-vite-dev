import { Controller } from "@hotwired/stimulus"
import "./welcome_controller.scss";

export default class controller extends Controller {
  static targets = [
    "title",
    "button"
  ]
  static values = {
    name: String,
    count: {
      type: Number,
      default: 0
    }
  }
  connect() {
    this.titleTarget.textContent = `hello ${this.nameValue}`;
  }
  increment() {
    this.countValue++
  }
  countValueChanged() {
    this.updateButtonText()
  }
  updateButtonText() {
    this.buttonTarget.textContent = `count : ${this.countValue}`
  }
}