let inputs = []

const boundary = {
  init: ()=>{
    for (let i = 0; i < 3; i++)
      inputs.push(p.createSlider(1, 6, 3).elt);
  
    showBoundary()
  },
  update: ()=>{
    showBoundary()
  }
}
function showBoundary(){
  let [n,m,r] = inputs.map(i => i.value);
  let ref =
    new HexCoord(-(n-1)/2, -(m-1)/2, -(r-1)/2)
    .toCoord(20)
    .add(new Coord(p.width / 2, p.height / 2))
  
  canvas.empty();
  let pos = [0,0,0]
  const tile = () => new TileNode(grid, new HexCoord(...pos), new HexCoord(...pos).toCoord(20).add(ref), 20, "#9284aa", ()=>{})
  for (let i = 0; i < n-1; i++){
    canvas.adopt(tile())
    pos[0]++;
  }
  for (let i = 0; i < m-1; i++){
    canvas.adopt(tile())
    pos[1]++;
  }
  for (let i = 0; i < r-1; i++) {
    canvas.adopt(tile())
    pos[2]++;
  }
  for (let i = 0; i < n-1; i++){
    canvas.adopt(tile())
    pos[0]--;
  }
  for (let i = 0; i < m-1; i++) {
    canvas.adopt(tile())
    pos[1]--;
  }
  for (let i = 0; i < r-1; i++) {
    canvas.adopt(tile())
    pos[2]--;
  }
}