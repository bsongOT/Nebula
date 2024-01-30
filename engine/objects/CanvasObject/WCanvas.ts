import { Family } from "@/factors/Family";
import { Coord } from "../../coord-system";
import { DOMObject } from "../DOMObject";
import {CanvasObject} from "./CanvasObject"
import p5 from "p5"
import { HTMLObject } from "../HTMLObject";

export class WCanvas extends DOMObject<"div">{
  public readonly p:p5;
  public readonly family!:Family<CanvasObject, HTMLObject, this>
  constructor(w:number, h:number){
    super("div");
    this.p = new p5((pp:p5) => {
      pp.setup = () => {
        this.p.createCanvas(w, h).parent(this.element);
      }
      pp.draw = () => {
        pp.background("#aaaaaa");
        
        this.family.tour((n)=>{
          if (!(n instanceof CanvasObject)) return;
          n.update().render(this.p);
        })
      },
      pp.mousePressed = () => {
        this.family.tour((n)=>{
          if (!(n instanceof CanvasObject)) return;
          if (n.isIn(new Coord(this.p.mouseX, this.p.mouseY))){
            n.input.click.invoke()
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