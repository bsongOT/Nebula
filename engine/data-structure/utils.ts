import { H, HexCoord } from "@/utils/math/coord-system";
import { HexWorld } from "./hexworld";
import { Tree, TreeNode } from "./tree";
import { HexGrid } from "./hexgrid";

export function toPaths<T>(tree:Tree<T>){
  const threshold = 15;
  const paths = new Array<{pos:HexCoord, node:TreeNode<T>}[]>();
  const travel = tree.traverse();

  let pos = H(0, 0, 0);
  let path = new Array<{pos:HexCoord, node:TreeNode<T>}>()

  for (let i = 0; i < travel.length; i++){
    const d = travel[i].depth;
    const nextD = travel[i + 1]?.depth;
    
    path.push({
      pos: H(pos.x, pos.y, pos.z),
      node: travel[i].node
    })
    
    if (nextD == undefined) {
      paths.push(path);
      break;
    }

    if (path.length >= threshold){
      paths.push(path)
      path = [];
      pos = H(0, 0, d);
      continue;
    }

    if (d < nextD) pos.z += nextD - d;
    else if (d === nextD) pos.y++;
    else pos.x += d - nextD;
  }
  
  return paths;
}