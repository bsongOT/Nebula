import { H } from "@/utils/math/coord-system";
import { HexWorld } from "./hexworld";
import { Tree } from "./tree";

export function gridify<T>(tree:Tree<T>){
  const grid = new HexWorld<T>();

  let pos = H(0, -1, 0);
  let prevD = 0;

  tree.tourNode(tree.root, (n, d) => {
    if (prevD < d) pos.z += d - prevD;
    else if (prevD === d) pos.y++;
    else pos.x += prevD - d;

    grid.setVal(pos, n.data);
    prevD = d;
  })

  return grid;
}