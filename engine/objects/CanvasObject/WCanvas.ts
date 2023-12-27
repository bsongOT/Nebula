import { Coord } from "../../coord-system";
import {DOMObject} from "../WebObject"
import {CanvasObject} from "./CanvasObject"
import p5 from "p5"
import { CanvasBoardFamily } from "@/factors/families/CanvasFamily";
import { NeverOccuredEvent } from "@/factors/events/NeverOccurredEvent";

export class WCanvas extends DOMObject{
  public readonly p:p5;
  public event!:NeverOccuredEvent<this>;
  public family!:Family<CanvasObject, DOMObject, this>
  public static new(w:number, h:number){
    const c = new WCanvas(w, h)
    c.family = new CanvasBoardFamily(c, c.element)
    c.event = new NeverOccuredEvent()
    c.init()
    return c;
  }
  protected constructor(w:number, h:number){
    super();
    const tour = (node:CanvasObject, func:(o:CanvasObject)=>void) => {
      for (let c of node.family.children){
        func(c)
        tour(c, func)
      }
    }
    this.p = new p5((pp:p5) => {
      pp.setup = () => {
        this.p.createCanvas(w, h).parent(this.element);
      }
      pp.draw = () => {
        pp.background("#aaaaaa");
        
        tour(this as any, (n)=>{
          n.update().render(this.p);
        })
      },
      pp.mousePressed = () => {
        tour(this as any, (n)=>{
          if (n.isIn(new Coord(this.p.mouseX, this.p.mouseY))){
            n.event.click.invoke()
          }
        })
      }
    });
  }
  public get width(){
    return this.p.width;
  }
  public get height(){
    return this.p.height;
  }
}