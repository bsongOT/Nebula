import { Family } from "@/factors/Family";
import { Coord } from "../../coord-system";
import { DOMObject } from "../DOMObject";
import {CanvasObject} from "./CanvasObject"
import p5 from "p5"
import { HTMLObject } from "../WebObject";

export class WCanvas extends DOMObject<"div">{
  public readonly p:p5;
  public readonly family!:Family<CanvasObject, HTMLObject, this>
  constructor(w:number, h:number){
    super("div");
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