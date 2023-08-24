const neighbor = {
  init: () => {
  let ref =
    new HexCoord(-2.5, -2.5, -2.5)
    .toCoord(20)
    .add(new Coord(p.width / 2, p.height / 2))
  
  for (let i = 0; i < 2 * grid.size - 1; i++) {
    let [min, max] = [grid.min(i), grid.max(i)]
    for (let j = min; j < max; j++)
      grid.setVal(i, 0, j, canvas.adopt(
        new TileNode(grid, new HexCoord(i, 0, j),
          new HexCoord(i, 0, j).toCoord(20).add(ref),
          20, "#cccccc",
          neighborAction
        )))
    }
  },
  update: () => {}
}

function neighborAction(){
  this.parent.children.forEach(c => c.color = "#cccccc")
  this.color = "#97aa63"
  const $ = (w, x, y) => this.grid.at(
    this.hexpos.one + w,
    this.hexpos.three + x,
    this.hexpos.five + y
  )
  $(1, 0, 0).color = "#9acc11";
  $(-1, 0, 0).color = "#9acc11";
  $(0, 1, 0).color = "#9acc11";
  $(0, -1, 0).color = "#9acc11";
  $(0, 0, 1).color = "#9acc11";
  $(0, 0, -1).color = "#9acc11";
}