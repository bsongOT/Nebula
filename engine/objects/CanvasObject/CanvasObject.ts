import {Form} from "../../factors/forms/Form"
import { Coord } from "../../coord-system";
import p5 from "p5";
import { Tree, TreeNode } from "@/data-structure/tree";

export abstract class CanvasObject {
  public abstract readonly form:Form;
  public abstract update():this;
  public abstract render(p:p5):this;
  public abstract isIn(point:Coord):boolean;
  private node:TreeNode<CanvasObject>|undefined;

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