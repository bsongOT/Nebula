import { btn, div, li, slider, span, ul } from "@/funcObject";
import { selli } from "@/objects/UI/list/selli";
import "./nebula-viewer.css"
import { Nebula, data } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";

class CommonNebulaViewer {
  public readonly element:HTMLElement;
  public readonly layout;
  constructor(nebulas:DataCollection<Nebula>){
    this.layout = {
      tree: ul({class: "nebula-tree"})()
    }
    this.element = div()(
      ul()(
        ...nebulas.map(n => (
          selli({onclick: ()=>this.showTree(n)})(
            span()(n.name)
          )
        ))
      ),
      this.layout.tree
    )
  }
  public showTree(nebula:Nebula){
    this.layout.tree.innerHTML = "";
    this.layout.tree.append(li()(span()("Hello World")))
  }
}

class LifetimeNebulaViewer {
  public readonly element:HTMLElement;
  constructor(){
    this.element = div()(
      ul()(
        li()(span()("New")),
        li()(span()("Modified")),
        li()(span()("Live")),
        li()(span()("Deleted"))
      )
    )
  }
}

class DayNebulaViewer {
  public readonly element:HTMLElement;
  constructor(){
    this.element = div()(
      span()("Period"),
      slider({value: 1, min: 1, max: 100}),
      div()(
        btn()("1 day"),
        btn()("3 days"),
        btn()("1 week"),
        btn()("2 weeks"),
        btn()("1 month")
      ),
      ul()()
    )
  }
}

class ImportanceNebulaViewer {
  public readonly element:HTMLElement;
  constructor(){
    this.element = div()(
      span()("gap"),
      slider({ value: 0 }),
      btn()("-5"), btn()("-3"), btn()("-1"),
      btn()("+1"), btn()("+3"), btn()("+5"),
      ul()(
        li()(span()("Nebula Count")),
        li()(span()("Parent Count")),
        li()(span()("Child Count")),
        li()(span()("Dust Count"))
      )
    )
  }
}

export class NebulaViewer {
  public readonly element:HTMLElement;
  public readonly managers;
  public readonly layout;
  constructor(){
    this.managers = {
      common: new CommonNebulaViewer(data.nebulas),
      lifetime: new LifetimeNebulaViewer(),
      day: new DayNebulaViewer(),
      importance: new ImportanceNebulaViewer()
    }
    this.layout = {
      bodyGroup: [{
        switch: selli()(span()("Common")),
        element: this.managers.common.element
      },{
        switch: selli()(span()("Lifetime")),
        element: this.managers.lifetime.element
      },{
        switch: selli()(span()("Day")),
        element: this.managers.day.element
      },{
        switch: selli()(span()("Importance")),
        element: this.managers.importance.element
        },{
        switch: selli()(span()("Query")),
        element: div()(
          ul()(), // Query Nebula List
          div()(
          span()("Main"),
            btn()("search"),
          ),
          div()(
            span()("Query"),
            div()(
              span()("Main") //main
              /**
               * nebula
               * and
               * or
               * not
               */
            )
          )
        )
        },{
          switch: selli()(span()("Transform")),
          element: div()(
            ul()(
              li()(span()("Zettelkasten")),
              li()(span()("Problem Solving")),
              li()(span()("Inverse Concept"))
            )
          )
        }
      ],
      body: div()(),
    }
    this.element = div()(
      ul({class: "nebula-category"})(
        ...this.layout.bodyGroup.map(g => g.switch)
      ),
      this.layout.body
    )

    for (const group of this.layout.bodyGroup){
      group.switch.onclick = () => {
        this.layout.body.innerHTML = "";
        this.layout.body.append(group.element)
      }
    }

    this.layout.bodyGroup[0].switch.click()
  }
}