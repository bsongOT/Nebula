import { Coord } from "@/coord-system";
import { PolygonForm } from "@/infos/PolygonForm";
import { CanvasContainer, CanvasScreen, Square } from "@/objects/CanvasObject/";
import { Radio, RadioBox } from "@/objects/input/";
import { nebulaSpaceSize } from "../../consts";
import {UpperMenu} from "../../custom-object/"
import {NebulaTile} from "../../custom-object/NebulaTile"
import {data} from "../../data/Data"
import "../../styles/NebulaSpace.css"
import { BodyObject, Text, ButtonObject, Container } from "@/objects";
import { emptyArr } from "@/utils/utils";

const size = nebulaSpaceSize;
const canvasSize = window.innerWidth - 80;
const scale = canvasSize / size;
new BodyObject([
  new UpperMenu(),
  new RadioBox([
    new Radio("tab").label("Nebula").check(),
    new Radio("tab").label("Universe")
  ]),
  new Container([
    new ButtonObject("<"),
    new CanvasScreen(canvasSize, canvasSize,
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
    new ButtonObject(">")
  ]).addClass("nebula-space"),
  new Text("1 / " + data.getNebulaSpaceTotalPage())
]);