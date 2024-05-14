import { btn, div, li, slider, span, ul } from "@/funcObject";
import { selli } from "@/objects/UI/list/selli";
import "./nebula-viewer.css"
import { Nebula, data } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";

function CommonNebulaEditor(info:{nebula:Nebula}) {
  return div()(
    ul({class: "nebula-tree"})()
  )
}
function TransformNebulaViewer(){
  return div()(
    ul()(
      li()(span()("Zettelkasten")),
      li()(span()("Problem Solving")),
      li()(span()("Inverse Concept"))
    )
  )
}

function LifetimeNebulaViewer(){
  return div()(
    ul()(
      li()(span()("New")),
      li()(span()("Modified")),
      li()(span()("Live")),
      li()(span()("Deleted"))
    )
  )
}

function DayNebulaViewer(){
  return div()(
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

function ImportanceNebulaViewer() {
  return div()(
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

function QueryNebulaEditor() {
  return div()(
    ul({class: "nebula-list"})(), // Query Nebula List
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
}

export function NebulaViewer(){
  
}