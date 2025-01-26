import { Repeat } from "@/engine";
import { Attribute, div, hr } from "@/funcObject";
import context from "../../context";
import { Universe } from "../../../backend/data/components/Universe";

export function UniverseSelector(){
    function Line(info:{universe: Universe}){
        const attr:Attribute<"div"> = {
            className: "hover-ccc",
            onclick: () => context.selection.universe = info.universe
        }
        return div(attr)(() => info.universe.name);
    }

    return (
      div({inlineStyle:{width: "300px"}})([
        Line({universe: context.data.systemUniverse}),
        hr()(),
        div()(
          Repeat(Line, () => context.data.universes.map(u => ({universe: u})))
        )
      ])
    )
  }