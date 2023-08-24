let inputs = [];

const area = {
  init: ()=>{
    for (let i = 0; i < 3; i++)
      inputs.push(p.createSlider(1, 6, 3).elt);
    
    showGetArea()
  },
  update: ()=>{
    showGetArea()
  }
}

function showGetArea(){
  canvas.empty();
  
  let [n,m,r] = inputs.map(i => i.value)
  let ref =
    new HexCoord(-(n-1)/2, -(m-1)/2, -(r-1)/2)
    .toCoord(20)
    .add(new Coord(p.width / 2, p.height / 2))
    
  let pos = [0,0,0]
  const tile = () => new TileNode(grid, new HexCoord(...pos), new HexCoord(...pos).toCoord(20).add(ref), 20, "#cccccc", ()=>{})
  
  for (let i = 0; i < n; i++){
    for (let j = 0; j < r; j++){
      pos = [i,0,j]
      canvas.adopt(tile())
    }
  }
  for (let i = 1; i < m; i++){
    pos = [n-1,i,0]
    for (let j = 0; j < r-1; j++){
      canvas.adopt(tile())
      pos[2]++;
    }
    for (let j = 0; j < n; j++){
      canvas.adopt(tile())
      pos[0]--;
    }
    canvas.adopt(
      new Line(
        new HexCoord(n-1,i,0).toCoord(20).add(ref),
        new HexCoord(n-1,i,r-1).toCoord(20).add(ref)
      )
    )
    canvas.adopt(
      new Line(
        new HexCoord(n-1,i,r-1).toCoord(20).add(ref),
        new HexCoord(0,i,r-1).toCoord(20).add(ref)
      )
    )
  }
  p.text(`${n}×${m}+(${n}+${m}-1)(${r}-1)=${n}(${m}-1)+${m}(${r}-1)+${r}(${n}-1)+1=${n*(m-1)+m*(r-1)+r*(n-1)+1}`,20,20)
}