let ends = [undefined, undefined]
const interpolation = {
  init: ()=> {
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
          selectEndPoints
      )))
  }
  },
  update: () => {}
}
function selectEndPoints(){
  this.parent.children.forEach(c => c.color="#cccccc")
  
  if (!ends[0]) ends[0] = this;
  else ends[1] = this;
  
  if (!ends[0] || !ends[1]) return;
  
  ends[0].color = "#8ab1a3";
  ends[1].color = "#8ab1a3"
  
  const sub = ends[0].hexpos.sub(ends[1].hexpos);
  
  let n = ends[0].hexpos.taxi_dist(ends[1].hexpos)
  
  if (n === 0 || isNaN(n)) n = 1
  
  for (let i = 0; i <= n; i++){
    const t = i / n
    const interp = 
      ends[0].hexpos.scale(1 - t).add(
      ends[1].hexpos.scale(t)).round()
  
    grid.at(interp.one, interp.three, interp.five).color = "#dd7a88"
  }
}