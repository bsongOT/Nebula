export class Tree<T>{
  nodes:TreeNode<T>[];
  root:TreeNode<T>;
  constructor(){
    this.nodes = [this.root = new TreeNode()];
  }
}
export class TreeNode<T>{
  data?:T;
  children:TreeNode<T>[];
  constructor(data?:T){
    this.data = data
    this.children = [];
  }
}