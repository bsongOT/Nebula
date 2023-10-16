import { Coord } from "../../engine/coord-system";
import { Tree, TreeNode } from "../../engine/data-structure/tree"
import { Content } from "./Data";
import { DataCollection } from "./DataCollection";
import { DataComponent } from "./DataComponent";

export type NebulaKind = "Type"|"Story"
export class Nebula implements DataComponent{
  name:string;
  id:number;
  kind:NebulaKind;
  orient:TreeNode<Content>;
  tree:Tree<Content>
  position:Coord;
  constructor(name:string, id:number, kind:NebulaKind, position:Coord, tree:Tree<Content>, orientIndex:number){
    this.name = name;
    this.id = id;
    this.kind = kind;
    this.tree = tree
    this.orient = this.tree.at(orientIndex)
    this.position = position;
  }
  public pack(){
    let treeOrder = [];
    this.tree.map<{id,index}>((c, _, i) => ({
      id: c.id,
      index: i
    })).tourNode(n => {
      treeOrder.push({
        id: n.data.id,
        parent: (n.parent.data ? n.parent.data.index : -1)
      })
    })
    return {
      name: this.name,
      id: this.id,
      kind: this.kind,
      tree: treeOrder,
      orient: this.tree.indexOf(this.orient),
      position: {
        x: this.position.x,
        y: this.position.y
      }
    }
  }
  public static load(obj:any, contents:DataCollection<Content>):Nebula{
    let tree = new Tree<Content>();
    
    obj.tree.forEach((cinfo, i) => {
      obj.tree[i] = new TreeNode<Content>(tree, contents.get(cinfo.id));
      tree.insert(obj.tree[cinfo.parent] ?? tree.root, obj.tree[i])
    })

    return new Nebula(
      obj.name, obj.id, obj.kind,
      new Coord(obj.position.x, obj.position.y),
      tree, obj.orient
    )
  }
}