import { Coord, P } from "../utils/math/coord-system";
import p5 from "p5";
import { Tree, TreeNode } from "@/data-structure/tree";

export abstract class CanvasObject {
  public position:Coord;

  public abstract update():this;
  public abstract render(p:p5):this;
  public abstract isIn(point:Coord):boolean;
  private node:TreeNode<CanvasObject>|undefined;

  constructor(){
    this.position = P(0, 0);
  }

  public move(vector:Coord){
    this.position = this.position.add(vector);
  }

  public get children(){
    return this.node!.children.map(c => c.data)
  }
  public get parent(){
    return this.node?.parent?.data
  }

  public empty(){
    this.node!.children = []
  }
  public adopt(...children:CanvasObject[]){
    children.forEach(c => this.node?.tree.insert(new TreeNode(this.node!.tree, c)))
  }
}