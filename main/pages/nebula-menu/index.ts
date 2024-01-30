import { Coord } from "@/coord-system";
import { PolygonForm } from "@/factors/forms/PolygonForm";
import { WCanvasContainer, WCanvas, WSquare } from "@/objects/CanvasObject/";
import { WRadio, WRadioBox } from "@/objects/input/";
import { nebulaSpaceSize } from "../../consts";
import {UpperMenu} from "../../custom-object/"
import {NebulaTile} from "../../custom-object/NebulaTile"
import {data} from "../../data/Data"
import "../../styles/NebulaSpace.css"
import { emptyArr } from "@/utils/utils";
import { body, btn, div, span } from "@/funcObject";

const size = nebulaSpaceSize;
const canvasSize = window.innerWidth - 80;
const scale = canvasSize / size;
body(
  new UpperMenu(),
  new WRadioBox([
    new WRadio("tab").label("Nebula").check(),
    new WRadio("tab").label("Universe")
  ]),
  div({class: "nebula-space"})(
    btn("<"),
    new WCanvas(canvasSize, canvasSize).family.adoptAll([
      new WCanvasContainer().family.adoptAll(
        (()=> {
          const tiles = emptyArr(size).map(_ => emptyArr(size)) as WSquare[][];
          const nebulas = data.nebulas;
        
          for (let i = 0; i < size; i++){
            for (let j = 0; j < size; j++){
              tiles[j][i] = new WSquare()

              tiles[j][i].form.moveAt(i * scale, j * scale)
              tiles[j][i].form.setSide(scale)
              tiles[j][i].form.setColor("#eeeeee")
            }
          }
          for (let n of nebulas.all()){
            tiles[n.position.y][n.position.x] = new NebulaTile(n, scale)
          }
          return tiles.flat();
        })()
      )
    ]),
    btn(">")
  ),
  span("1 / " + data.getNebulaSpaceTotalPage())
);