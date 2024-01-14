import { div, btn, select } from "@/funcObject";
import { WCheckbox } from "@/objects/input/";

const checker = () =>
  div(
    btn("Checker"),
    div(
      new WCheckbox().label("Nebula"),
      select(),
      new WCheckbox().label("Parent"),
      select(), // nebula
      select() //stars
    )
  );