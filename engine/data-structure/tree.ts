export type TreeLike<T> = {
  nodes: TreeNodeLike<T>[],
  root: TreeNodeLike<T>
}
export type TreeNodeLike<T> = {
  data?:T,
  children:TreeNodeLike<T>[]
}

export class Tree<T>{
  nodes:TreeNode<T>[];
  root:TreeNode<T>;
  get length(){
    return this.nodes.length;
  }
  constructor(){
    this.nodes = [this.root = new TreeNode(this)];
  }
  static fromNode<T>(treeNodeLike:TreeNodeLike<T>){
    let tree = new Tree<T>()
    
    const copyTree = (from:TreeNodeLike<T>, to:TreeNode<T>)=>{
      for (let i = 0; i < from.children.length; i++){
        tree.insert(to, new TreeNode(tree, from.children[i].data))
        copyTree(from.children[i], to.children[i])
      }
    }

    copyTree(treeNodeLike, tree.root)

    return tree;
  }
  static from<T>(treeLike:TreeLike<T>){
    return Tree.fromNode<T>(treeLike.root)
  }
  insert(parent:TreeNode<T>, child:TreeNode<T>){
    this.remove(child)
    parent.children.push(child);
    child.parent = parent;
    this.nodes.push(child)
    return child;
  }
  insertAsLeftFriend(member:TreeNode<T>, left:TreeNode<T>){
    this.remove(left)
    if (!member.parent) return;
    member.parent.children.splice(
      member.parent.children.indexOf(member),
      0, left
    )
    left.parent = member.parent;
    this.nodes.push(left)
  }
  insertAsRightFriend(member:TreeNode<T>, right:TreeNode<T>){
    this.remove(right)
    if (!member.parent) return;
    member.parent.children.splice(
      member.parent.children.indexOf(member) + 1,
      0, right
    )
    right.parent = member.parent;
    this.nodes.push(right)
  }
  remove(node:TreeNode<T>){
    if (node.parent){
      node.parent.children =
      node.parent.children.filter(c => c !== node)
    }
    node.parent = undefined;
    this.nodes = this.nodes.filter(n => n !== node);
  }
  at(index:number){
    const len = this.length;
    index = (index + len) % len;

    let i = 0;
    const access = (n:TreeNode<T>)=> {
      for (let c of n.children){
        if (index === i) return c;
        i++;
        access(c)
      }
    }

    return access(this.root)
  }
  indexOf(node:TreeNode<T>){
    let i = 0
    const indexOf = (n:TreeNode<T>) => {
      for (let c of n.children){
        if (c === node) return true;
        i++;
        indexOf(c)
      }
    }
    return indexOf(this.root) ? i : -1
  }
  tourNode(func:(n:TreeNode<T>, depth?:number)=>void){
    const tour = (n:TreeNode<T>, depth?:number) => {
      for(let c of n.children){
        func(c, depth)
        tour(c, depth??0 + 1)
      }
    }
    return tour(this.root, 0)
  }
  tour(func:(n:T|undefined, depth?:number)=>void){
    return this.tourNode((node, depth)=>func(node.data, depth))
  }
  every(condition:(n:T|undefined)=>boolean){
    return this.nodes.map(n => n.data).every(condition)
  }
  map<U>(func:(data:T|undefined, beforNode?:TreeNode<T>, node?:TreeNode<U>, index?:number)=>U){
    const tree = new Tree<U>()
    let index = 0;
    const mapping = (node:TreeNode<T>, target:TreeNode<U>) => {
      for (let c of node.children){
        const n = new TreeNode<U>(tree)
        n.data = func(c.data, c, n, index)
        tree.insert(target, n)
        index++;
        mapping(c, n)
      }
    }

    mapping(this.root, tree.root);
    return tree;
  }
}
export class TreeNode<T>{
  data?:T;
  tree:Tree<T>;
  parent?:TreeNode<T>;
  children:TreeNode<T>[];
  get leftFriend():TreeNode<T>|undefined{
    if (!this.parent) return undefined;
    const cren = this.parent.children;
    return cren[cren.indexOf(this) - 1]
  }
  get rightFriend():TreeNode<T>|undefined{
    if (!this.parent) return undefined;
    const cren = this.parent.children;
    return cren[cren.indexOf(this) + 1]
  }
  constructor(tree:Tree<T>, data?:T){
    this.tree = tree;
    this.data = data;
    this.children = [];
  }
}