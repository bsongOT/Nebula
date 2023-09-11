import {ButtonObject, Container, Detail, InputObject, SelectMenu, Text} from "../"
import { Checkbox } from "../../../engine/objects/input/Checkbox";

export class Checker extends Detail{
  constructor(){
    super([
      new ButtonObject("Checker"),
      new Container([
        new Checkbox().label("Nebula"),
        new SelectMenu([]),
      ])
    ]);
  }
}