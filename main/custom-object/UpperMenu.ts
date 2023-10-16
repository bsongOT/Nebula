import {Navigator, HyperLink} from "@/objects/"

export const paths = [
  "./index.html",
  "./todo.html",
  "./nebula-menu.html",
  "./playground-menu.html",
  "./relation.html"
];

export class UpperMenu extends Navigator{
  constructor(){
    super([
      new HyperLink("Home", paths[0]),
      new HyperLink("Todo", paths[1]),
      new HyperLink("Nebula", paths[2]),
      new HyperLink("Playground", paths[3]),
      new HyperLink("Relation", paths[4])
    ])
  }
}