import { engine } from "@/engine";
import { CanvasObject } from "./CanvasObject";

type Layout = {
    [key:string|number]: Layout | UIManager | HTMLElement | CanvasObject | undefined | (Layout | UIManager | HTMLElement | CanvasObject | undefined)[]
}

export abstract class UIManager {
  public abstract element:HTMLElement;
  public abstract info:Record<string, any>;
  public abstract layout:Layout;

  public init(){
    engine.updater.register(() => {
      if (!document.contains(this.element)) return;

      this.update()
    })
  }
  public update(){};
}