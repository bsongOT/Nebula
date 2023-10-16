import { Coord } from "../../coord-system";
import {WebObject} from "../WebObject"
import {CanvasObject} from "./CanvasObject"
import p5 from "p5"

export class CanvasScreen extends WebObject<CanvasObject<any>, any>{
  public p:p5;
  constructor(w:number, h:number, children?:CanvasObject<any>[]){
    super();
    const tour = (node:CanvasObject<any>, func:(o:CanvasObject<any>)=>void) => {
      for (let c of node.children){
        func(c)
        tour(c, func)
      }
    }
    this.p = new p5((pp:p5) => {
      pp.setup = () => {
        this.p.createCanvas(w, h).parent(this.element);
        (children??[]).forEach(c => this.adopt(c))
      }
      pp.draw = () => {
        pp.background("#aaaaaa");
        
        tour(this as any, (n)=>{
          n.p = this.p;
          n.update().render();
        })
      },
      pp.mousePressed = () => {
        tour(this as any, (n)=>{
          if (n.isIn(new Coord(this.p.mouseX, this.p.mouseY))){
            n.click()
          }
        })
      }
    });
  }
  public get value(){
    return;
  }
  public get width(){
    return this.p.width;
  }
  public get height(){
    return this.p.height;
  }
  public adopt<T extends CanvasObject<any>>(obj:T):T{
    this.children.push(obj)
    obj.parent = this;
    return obj;
  }
}