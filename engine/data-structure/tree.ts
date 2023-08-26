export class Tree{
  nodes:TreeNode[];
  root:TreeNode;
  constructor(){
    this.nodes = [this.root = new TreeNode()];
  }
}
export class TreeNode{
  data:any;
  children:TreeNode[];
  constructor(data?:any){
    this.data = data
    this.children = [];
  }
}