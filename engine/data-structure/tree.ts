export type TreeLike<T> = {
  nodes: TreeNodeLike<T>[],
  root: TreeNodeLike<T>
}
export type TreeNodeLike<T> = {
  data:T,
  children:TreeNodeLike<T>[]
}

export class Tree<T>{
  public nodes:TreeNode<T>[];
  public root:TreeNode<T>;

  get length(){
    return this.nodes.length;
  }
  constructor(){
    this.nodes = [this.root = new TreeNode(this, undefined as any)];
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
  insert(child:TreeNode<T>, parent:TreeNode<T> = this.root){
    this.remove(child)
    parent.children.push(child);
    child.parent = parent;
    this.nodes.push(child)
    return child;
  }
  insertAsLeftFriend(member:TreeNode<T>, left:TreeNode<T>){
    if (!member.parent) return;
    this.remove(left)
    member.parent.children.splice(
      member.parent.children.indexOf(member),
      0, left
    )
    left.parent = member.parent;
    this.nodes.push(left)
  }
  insertAsRightFriend(member:TreeNode<T>, right:TreeNode<T>){
    if (!member.parent) return;
    this.remove(right)
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
  tourNode(start:TreeNode<T>, func:(n:TreeNode<T>, depth:number)=>void){
    const tour = (n:TreeNode<T>, depth:number) => {
      for(let c of n.children){
        func(c, depth)
        tour(c, (depth??0) + 1)
      }
    }
    return tour(start, 0)
  }
  tour(func:(n:T, depth:number)=>void){
    return this.tourNode(this.root, (node, depth)=>func(node.data, depth))
  }
  traverse(){
    let arr = new Array<{node:TreeNode<T>, depth: number}>()
    const traverse = (node:TreeNode<T>, depth?:number) => {
      for (const c of node.children){
        arr.push({
          node: c,
          depth: depth ?? 0
        });
        traverse(c, (depth ?? 0) + 1);
      }
    }
    traverse(this.root);
    return arr;
  }
  every(condition:(n:T)=>boolean){
    return this.nodes.map(n => n.data).every(condition)
  }
  map<U>(func:(data:T, index:number)=>U){
    const tree = new Tree<U>()
    let index = 0;
    const mapping = (node:TreeNode<T>, target:TreeNode<U>) => {
      for (let c of node.children){
        const n = new TreeNode<U>(tree, func(c.data, index))
        tree.insert(n, target)
        index++;
        mapping(c, n)
      }
    }

    mapping(this.root, tree.root);
    return tree;
  }
  arrayize(){
    const array = [] as {parent:number, data:T}[];
    const orderTree = this.map((data, index) => ({index:index, data:data}))
    
    orderTree.tourNode(orderTree.root, node => {
      array.push({
        parent: node.parent?.data?.index ?? -1,
        data: node.data.data
      })
    })

    return array
  }
  static treeize<U>(array:{parent:number, data:U}[]){
    const tree = new Tree<U>()
    const treeOrder = array.map(v => new TreeNode(tree, v.data))
    
    for (let i = 0; i < array.length; i++){
      tree.insert(treeOrder[i], treeOrder[array[i].parent] ?? tree.root)
    }

    return tree;
  }
}
export class TreeNode<T>{
  data:T;
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
  constructor(tree:Tree<T>, data:T){
    this.tree = tree;
    this.data = data;
    this.children = [];
  }
}