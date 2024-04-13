import { nav, a } from "@/funcObject";

const menus = [{
    name: "Home",
    path: "./index.html"
  },{
    name: "Nebula",
    path: "./nebula-menu.html"
  },{
    name: "Data",
    path: "./data.html"
  },{
    name: "Test",
    path: "./test.html"
  }
]

export const upperMenu = () => nav()(
  ...menus.map(m => a({href: m.path})(m.name))
)