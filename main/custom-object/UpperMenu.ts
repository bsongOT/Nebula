import {Navigator, HyperLink} from "./"

const paths = [
  "../main/index.html",
  "../todo/todo.html",
  "../nebula-menu/nebula-menu.html",
  "../playground-menu/playground-menu.html"
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