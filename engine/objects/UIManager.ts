import { engine } from "@/engine";
import { CanvasObject } from "./CanvasObject";

type Layout = {
    [key:string|number]: Layout | HTMLElement | CanvasObject | undefined | (Layout | HTMLElement | CanvasObject | undefined)[]
}

export abstract class UIManager {
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

export abstract class Mirror extends UIManager {
  public abstract info:Readonly<Record<string, any>>;
}