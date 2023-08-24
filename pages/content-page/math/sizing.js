let frame = 0
let [i, j, k] = [0, 0, 0]
let [n, m, r] = [5, 6, 3]
const s = 20;

const sizing = {
  init: () => {
  },
  update: () => {
    p.background("#aaaaaa")
  
    const center = new HexCoord((n-1)/2,(m-1)/2,(r-1)/2).toCoord(s)
    p.translate(p.width / 2 - center.x, p.height / 2 - center.y)
    if (frame % 5 === 0 && i < n){
      grid.setVal(i,j,k,canvas.adopt(new TileNode(
      new HexCoord(i,j,k).toCoord(s)
      , s, "#cccccc")))
      k++;
      if (k >= r){
        k = 0;
        j++;
      }
      if (j >= m){
        j = 0;
        i++;
      }
    }
  
    frame++;
  }
}