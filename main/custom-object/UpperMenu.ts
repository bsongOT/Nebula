import {WNavigator, WHyperLink} from "@/objects/"

const paths = [
  "./index.html",
  "./todo.html",
  "./nebula-menu.html",
  "./playground-menu.html",
  "./relation.html",
  "./test.html"
];

export class UpperMenu extends WNavigator{
  constructor(){
    super();
    this.family.adoptAll([/*
      new WHyperLink("Home", paths[0]),
      new WHyperLink("Todo", paths[1]),
      new WHyperLink("Nebula", paths[2]),
      new WHyperLink("Playground", paths[3]),
      new WHyperLink("Relation", paths[4]),
      new WHyperLink("Test", paths[5])*/
    ])
  }
}