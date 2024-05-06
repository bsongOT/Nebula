import { Container, Hexagon } from "@/objects/CanvasObject";
import { StarTile } from "../../../global objects";
import { H, P } from "@/utils/math/coord-system";
import { canvas } from "@/funcObject";
import { Nebula } from "../../../data/Data";
import { UIManager } from "@/objects/UIManager";
import { gridify } from "@/data-structure/utils";

export class NebulaModel extends UIManager {
  public readonly layout;
  public readonly info;
  public readonly element;

  private readonly selection;

  constructor(selection: { nebula?: Nebula; }) {
    super();
    this.info = {};
    this.layout = {
      tileBox: new Container(),
      effectBox: new Container()
    };
    this.element = canvas()(
      this.layout.tileBox,
      this.layout.effectBox
    );
    this.selection = selection
  }
  public update() {
    if (!this.selection.nebula) return;
    this.layout.tileBox.empty();

    const tileBox = this.layout.tileBox;
    const canvasSize = this.element.clientWidth;
    const canvasCenter = P(1, 1).scale(canvasSize / 2);
    const grid = gridify(this.selection.nebula.tree);
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
  }
}
