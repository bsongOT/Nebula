import { WButton, WContainer, WDetail, SelectMenu} from "@/objects/"
import { WCheckbox } from "@/objects/input/";

export class Checker extends WDetail{
  constructor(){
    super([
      new WButton("Checker"),
      new WContainer([
        new WCheckbox().label("Nebula"),
        new SelectMenu([]),
        new WCheckbox().label("Parent"),
        new SelectMenu([]), // nebula
        new SelectMenu([]) //stars
      ])
    ]);
  }
}