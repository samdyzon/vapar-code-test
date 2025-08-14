import "./vapar.css"
import { Application, Controller } from "@hotwired/stimulus";
import { createRoot } from "react-dom/client";

class AppRenderController extends Controller {
  static targets = ["container"];

  async connect() {
    this.root = createRoot(this.containerTarget);

    const module = import("@vapar/frontend/src/VaparApp");
    const { AppWrapper } = await module;

    this.root.render(AppWrapper());
  }
}

const application = Application.start();
application.register("app", AppRenderController);