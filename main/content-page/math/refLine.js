const refLine = {
  init: ()=>{
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
            showLine
          )))
    }
  },
  update: ()=>{}
}
function showLine(){
  this.parent.children.forEach(c => c.color = "#cccccc")
  this.parent.children.forEach(c => {
    if (c.hexpos.one - c.hexpos.five === this.hexpos.one - this.hexpos.five)
        c.color = "#839911"
    if (c.hexpos.three + c.hexpos.five === this.hexpos.three + this.hexpos.five)
        c.color = "#839911"
    if (c.hexpos.one + c.hexpos.three === this.hexpos.one + this.hexpos.three)
      c.color = "#839911"
  })
  this.color = "#9acc78"
}