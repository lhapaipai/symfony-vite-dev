import { Controller } from "@hotwired/stimulus"
import "./counter_optional_lazycontroller.scss";

export default class controller extends Controller {
  static targets = [
    "button"
  ]
  static values = {
    count: {
      type: Number,
      default: 0
    }
  }
  connect() {
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