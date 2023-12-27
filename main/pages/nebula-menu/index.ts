import { Coord } from "@/coord-system";
import { PolygonForm } from "@/factors/forms/PolygonForm";
import { CanvasContainer, WCanvas, Square } from "@/objects/CanvasObject/";
import { Radio, RadioBox } from "@/objects/input/";
import { nebulaSpaceSize } from "../../consts";
import {UpperMenu} from "../../custom-object/"
import {NebulaTile} from "../../custom-object/NebulaTile"
import {data} from "../../data/Data"
import "../../styles/NebulaSpace.css"
import { WBody, WText, WButton, WContainer } from "@/objects";
import { emptyArr } from "@/utils/utils";

const size = nebulaSpaceSize;
const canvasSize = window.innerWidth - 80;
const scale = canvasSize / size;
new WBody([
  new UpperMenu(),
  new RadioBox([
    new Radio("tab").label("Nebula").check(),
    new Radio("tab").label("Universe")
  ]),
  new WContainer([
    new WButton("<"),
    new WCanvas(canvasSize, canvasSize,
    [
      new CanvasContainer(
        (()=> {
          let tiles = emptyArr(size).map(_ => emptyArr(size));
          const nebulas = data.nebulas;
        
          for (let i = 0; i < size; i++){
            for (let j = 0; j < size; j++){
              tiles[j][i] = new Square(
                new PolygonForm(
                  new Coord(i, j).scale(scale),
                  scale, "#eeeeee"
                )
              )
            }
          }
          for (let n of nebulas.all()){
            tiles[n.position.y][n.position.x] = new NebulaTile(n, scale)
          }
          return tiles.flat();
        })()
      )
    ]),
    new WButton(">")
  ]).class.add("nebula-space"),
  new WText("1 / " + data.getNebulaSpaceTotalPage())
]);