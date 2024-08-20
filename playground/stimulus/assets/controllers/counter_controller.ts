import { Controller } from "@hotwired/stimulus"
import "./counter_controller.scss";

import.meta.stimulusFetch = "lazy";
import.meta.stimulusControllerIdentifier = "counter";


export default class controller extends Controller {
  declare buttonTarget: HTMLButtonElement;
  declare countValue: number;

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