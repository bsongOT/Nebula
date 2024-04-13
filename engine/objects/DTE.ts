import { engine } from "@/engine";
import { CanvasObject } from "./CanvasObject";

type Layout = {
    [key:string]: Layout | HTMLElement | CanvasObject | undefined
}

export abstract class DTE {
  public abstract element:HTMLElement;
  public abstract info:Record<string, any>;
  public abstract layout:Layout;

  public init(){
    engine.updater.register(() => {
      if (!document.contains(this.element)) return;
      if (!this.detect()) return;

      this.update()
    })
  }
  public abstract update():void;
  public abstract detect():boolean;
}