import { Controller } from "@hotwired/stimulus";

export default class controller extends Controller {
  notify() {
    fetch("/notify")
  }
}