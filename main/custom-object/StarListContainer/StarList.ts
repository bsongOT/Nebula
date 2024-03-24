import { Tree } from "@/data-structure/tree";
import { li, ul } from "@/funcObject";

const treeEqual = (tree1:Tree<any>, tree2:Tree<any>) => {
  const array1 = tree1.arrayize()
  const array2 = tree2.arrayize()

  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++){
    if (array1[i].data !== array2[i].data) return false;
    if (array1[i].parent !== array2[i].parent) return false;
  }

  return true;
}

export const treeList = <T>(tree: Tree<T>, nodeCreator: (data:T, index:number) => HTMLElement) => {
  const obj = ul({class: "tree-list"})();

  let oldTree = tree.map(v => v)
  
  setInterval(()=>{
    if (treeEqual(tree, oldTree)) return;

    obj.innerHTML = "";
    
    const childTree = tree.map(nodeCreator);

    childTree.tourNode(childTree.root, n => {
      if (!n.parent || n.parent === n.tree.root){
        return obj.append(li()(n.data))
      }
      if (!n.parent.data.children[1])
        n.parent.data.append(ul()())
      n.parent.data.children[1].append(n.data)
    })

    oldTree = tree.map(v => v);
  }, 100)

  return obj;
}