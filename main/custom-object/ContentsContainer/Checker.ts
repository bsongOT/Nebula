import {ButtonObject, Container, Detail, SelectMenu} from "@/objects/"
import { Checkbox } from "@/objects/input/";

export class Checker extends Detail{
  constructor(){
    super([
      new ButtonObject("Checker"),
      new Container([
        new Checkbox().label("Nebula"),
        new SelectMenu([]),
        new Checkbox().label("Parent"),
        new SelectMenu([]), // nebula
        new SelectMenu([]) //stars
      ])
    ]);
  }
}