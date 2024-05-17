import { Container, Hexagon } from "@/objects/CanvasObject";
import { StarTile } from "./StarTile";
import { H, P } from "@/utils/math/coord-system";
import { canvas } from "@/funcObject";
import { Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { gridify } from "@/data-structure/utils";

export function NebulaModel(selection: { nebula?: Nebula; }) {
    const tileBox = new Container();
    const effectBox = new Container();

    let width = 500;
    
    tileBox.update = () => {
      if (!selection.nebula) return tileBox;
      tileBox.empty();
  
      const canvasSize = width;
      const canvasCenter = P(1, 1).scale(canvasSize / 2);
      const grid = gridify(selection.nebula.tree);
      const size = grid.size.x;
      const pivot = H(1, 0, 1).scale(size - 1);
  
      for (const pos of grid.range) {
        const content = grid.at(pos);
        const tile = content ? new StarTile("none", content) : new Hexagon();
        const coord = pos.sub(pivot).toCoord(20).add(canvasCenter);
  
        tile.position = coord;
        tile.side = 20;
  
        tileBox.adopt(tile);
      }
  
      return tileBox;
    }
    
    return canvas()(
      tileBox,
      effectBox
    );
}
