import {tour} from "../../../utils/utils.js"
import {BodyObject} from "../../../objects/BodyObject.js"
import {CanvasScreen} from "../../../objects/CanvasObject/CanvasScreen.js"
import {Line} from "../../../objects/CanvasObject/Line.js"
import {TileNode} from "./TileNode.js"
import {Coord, HexCoord} from "../../../utils/CoordConverter.js"
import {HexGrid} from "../../../data-structure/hexgrid.js"

const p = new p5((pp) => {
  pp.setup = () => {
    init()
  },
  pp.draw = () => {
    tour(canvas, 0, 0, (n) => {
      if (n === canvas) return;
      if (n.isIn(p.mouseX, p.mouseY)) {
        n.mouseOver();
      }
    })
    update();
  }
  pp.mousePressed = () => {
    tour(canvas, 0, 0, (n) => {
      if (n === canvas) return;
      if (n.isIn(p.mouseX, p.mouseY)) {
        n.click();
      }
    })
  }
})

const body = new BodyObject();
let canvas;

let grid = new HexGrid(6);
let inputs = [];
let frame = 0;

function initGrid(){
  canvas.empty();
  
  let [n, m, r] = inputs.map(i => i.value)
  let ref =
    new HexCoord(-(n - 1) / 2, -(m - 1) / 2, -(r - 1) / 2)
    .toCoord(20)
    .add(new Coord(p.width / 2, p.height / 2))
  
  let pos = [0, 0, 0]
  const tile = () => new TileNode(grid, new HexCoord(...pos), new HexCoord(...pos).toCoord(20).add(ref), 20, "#cccccc", () => {})
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < r; j++) {
      pos = [i, 0, j]
      grid.setVal(...pos,canvas.adopt(tile()))
    }
  }
  for (let i = 1; i < m; i++) {
    pos = [n - 1, i, 0]
    for (let j = 0; j < r - 1; j++) {
      grid.setVal(...pos,canvas.adopt(tile()))
      pos[2]++;
    }
    for (let j = 0; j < n; j++) {
      grid.setVal(...pos,canvas.adopt(tile()))
      pos[0]--;
    }
  }
  scenes = []
  for (let i = 0; i < n; i++){
    for (let j = 0; j < m; j++){
      for (let k = 0; k < r; k++){
        scenes.push([i,j,k])
      }
    }
  }
  frame = 0;
}

let r;

const init = () => {
  canvas = new CanvasScreen(p, p.windowWidth, p.windowWidth);
  canvas.element.parent("figure-ui")
  for (let i = 0; i < 3; i++){
    const s = p.createSlider(1, 6, 3);
    s.parent("figure-ui")
    s.position(0, 30 * i)
    s.elt.onchange = function(){
      initGrid()
    }
    inputs.push(s.elt)
  }
  const systems = [
    "3 axis",
    "xy", "xz", "yz"
  ]
  r = p.createRadio()
  r.parent("figure-ui");
  r.position(200, 0);
  for (let i = 0; i < systems.length; i++){
    r.option(systems[i], systems[i])
  }
  r.selected("3 axis")
  
  const $ = (s)=>document.querySelector(s)
  const toggles = [
    ["#pet-main", "#claims-ui"], 
    ["#pet-parent", "#parent-ui"],
    ["#pet-relation", "#relation-ui"],
    ["#pet-compo", "#compo-ui"]
  ].map(t => [$(t[0]), $(t[1])])
  
  for (let t of toggles){
    t[0].addEventListener("change",
      function(){
        console.log(this.id)
        toggles.forEach(t => t[1].style = "")
        t[1].style.display = "block";
      }
    )
  }
  
  initGrid()
}

let scenes = [];

const update = () => {
  p.background("#aaaaaa")

  let [n, m, r] = inputs.map(i => i.value)
  
  if (frame % 6 === 5){
    const pos = scenes[(frame-5) / 6]
    const c = grid.at(...pos).color[1]
    grid.at(...pos).color = "#"+(parseInt(c, 16)-2).toString(16).repeat(6)
  }

  if (scenes.length === n * m * r && frame < 6 * n * m * r){
    frame++;
  }

  canvas.children.forEach((c) => {
    tour(c, 0, 0, (o) => {
      o.render()
    })
  })
}