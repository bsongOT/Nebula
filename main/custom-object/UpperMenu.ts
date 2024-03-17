import { nav, a } from "@/funcObject";
import {WNavigator, WHyperLink} from "@/objects/"

const menus = [{
    name: "Home",
    path: "./index.html"
  },{
    name: "Todo",
    path: "./todo.html"
  },{
    name: "Nebula",
    path: "./nebula-menu.html"
  },{
    name: "Relation",
    path: "./relation.html"
  },{
    name: "Tree",
    path: "./tree.html"
  },{
    name: "Data",
    path: "./data.html"
  },{
    name: "Test",
    path: "./test.html"
  }
]

export class UpperMenu extends WNavigator{
  constructor(){
    super();
    this.family.adoptAll(
      menus.map(m => new WHyperLink(m.name, m.path))
    )
  }
}
export const upperMenu = () => nav()(
  ...menus.map(m => a({href: m.path})(m.name))
)