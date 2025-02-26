import { Repeat, U } from "@/engine";
import { Attribute, div, hr, span } from "@/funcObject";
import context from "../../context";
import { Universe } from "../../../backend/data/components/Universe";
import { Nebula } from "../../../backend/data/Data";
import { Relation } from "../../../backend/data/components/Relation";
import { ChevronRight } from "lucide";
import { LucideIcon } from "../utils/Icon";

export function UniverseSelector(){
    function NebulaSelectorLine(info:{universe:Universe, nebula:Nebula}){
        return (
            div({
                className: "hover-eee",
                onclick: () => {
                    context.selection.universe = info.universe;
                    context.selection.nebula = info.nebula;
                    context.selection.content = undefined;
                },
                inlineStyle: U(() => ({
                    padding: "2px 50px",
                    background: context.selection.universe === info.universe && context.selection.nebula === info.nebula ? "skyblue" : ""
                }))
            })(() => info.nebula.name)
        )
    }
    function RelationSelectorLine(info:{universe:Universe, relation:Relation}){
        return (
            div()(
                div()(() => info.relation.mainTree.name + " - " + info.relation.secondTree.name),
                div()(
                    NebulaSelectorLine({
                        get universe(){ return info.universe },
                        get nebula(){ return info.relation.mainTree }
                    }),
                    NebulaSelectorLine({
                        get universe(){ return info.universe },
                        get nebula(){ return info.relation.secondTree }
                    })
                )
            )
        )
    }
    function Line(info:{universe: Universe}){
        let collapsed = true;
        const attr:Attribute<"div"> = {
            className: "hover-eee",
            inlineStyle: U(() => ({
                display: "flex",
                padding: "3px 20px",
                background: collapsed ? "" : "#eee"
            })),
            onclick: () => {
                collapsed = !collapsed;
            }
        }
        const nebulaListAttr:Attribute<"div"> = {
            inlineStyle: U(list => {
                if (collapsed) return { transition: "0.2s", overflow: "hidden", height: "0" }
                list.style.height = "0";
                return { transition: "0.2s", overflow: "hidden", height: list.scrollHeight + "px" };
            })
        }

        return (
            div()(
                div(attr)(
                    span({
                        inlineStyle: U(() => ({
                            translate: "0 -2px",
                            display: "inline-flex",
                            alignItems: "center",
                            transition: "0.1s",
                            rotate: collapsed ? "" : "90deg"
                        }))
                    })(
                        LucideIcon(ChevronRight, 16)
                    ),
                    span({inlineStyle: {display: "inline-flex", justifyContent: "center"}})(() => info.universe.name)
                ),
                div(nebulaListAttr)(
                    Repeat(NebulaSelectorLine, () => info.universe.nebulas.map(n => ({universe: info.universe, nebula: n})))
                ),
                div()(
                    Repeat(RelationSelectorLine, () => info.universe.relations.map(r => ({universe: info.universe, relation: r})))
                )
            )
        );
    }
    function IsolatedUniverseLine(){
        let collapsed = true;
        const attr:Attribute<"div"> = {
            className: "hover-eee",
            inlineStyle: U(() => ({
                display: context.data.isolatedUniverse.nebulas.length <= 0 ? "none" : "flex",
                padding: "3px 20px",
                background: collapsed ? "" : "#eee"
            })),
            onclick: () => {
                collapsed = !collapsed;
            }
        }
        const nebulaListAttr:Attribute<"div"> = {
            inlineStyle: U(list => {
                if (collapsed) return { transition: "0.2s", overflow: "hidden", height: "0" }
                list.style.height = "0";
                return { transition: "0.2s", overflow: "hidden", height: list.scrollHeight + "px" };
            })
        }
        return (
            div()(
                div(attr)(
                    span({
                        inlineStyle: U(() => ({
                            translate: "0 -2px",
                            display: "inline-flex",
                            alignItems: "center",
                            transition: "0.1s",
                            rotate: collapsed ? "" : "90deg"
                        }))
                    })(
                        LucideIcon(ChevronRight, 16)
                    ),
                    span({inlineStyle: {display: "inline-flex", justifyContent: "center"}})(context.data.isolatedUniverse.name),
                    span({
                        inlineStyle: {
                            marginLeft: "5px",
                            padding: "0 2px",
                            background: "red",
                            color: "white",
                            borderRadius: "3px"
                        }
                    })(() => context.data.isolatedUniverse.nebulas.length + "")
                ),
                div(nebulaListAttr)(
                    Repeat(NebulaSelectorLine, () => context.data.isolatedUniverse.nebulas.map(n => ({universe: context.data.isolatedUniverse, nebula: n})))
                )
            )
        );
    }

    return (
      div({inlineStyle:{width: "250px"}})([
          Line({universe: context.data.systemUniverse}),
          IsolatedUniverseLine(),
          hr()(),
          div()(
              Repeat(Line, () => context.data.universes.map(u => ({universe: u})))
          )
      ])
    )
  }