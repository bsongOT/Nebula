class Tree{
  nodes;
  constructor(){
    this.nodes = [new TreeNode()];
  }
}
class TreeNode{
  data;
  children;
  constructor(data){
    this.data = data
    this.children = [];
  }
}