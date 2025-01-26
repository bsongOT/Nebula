import { either, Repeat, U } from "@/engine"
import { div, btn } from "@/funcObject"
import context from "../../context"
import { Nebula } from "../../../backend/data/Data"
import { Relation } from "../../../backend/data/components/Relation"

function NebulaSelectorSingle(info:{nebula:Nebula}){
    return (
        div({class: "hover-ccc", inlineStyle: {display: "flex"}, onclick: () => context.selection.nebula = info.nebula})([
            div()(() => info.nebula.name)
        ])
    )
}
function RelationSelectorSingle(info:{relation:Relation}){
    return (
        div()(
            div({class: "hover-ccc", onclick: () => context.selection.relation = info.relation})(
                () => `${info.relation.mainTree.name} - ${info.relation.secondTree.name}`
            ),
            div({inlineStyle: {paddingLeft: "10px"}})(
                NebulaSelectorSingle({get nebula(){return info.relation.mainTree}}),
                NebulaSelectorSingle({get nebula(){return info.relation.secondTree}})
            )
        )
    )
}
export function NebulaSelector(){
    let mode = "nebula" as "nebula" | "relation"
    const bottomButtonStyle:Partial<CSSStyleDeclaration> = {
      border: "none",
      width: "50%",
      height: "30px",
      transition: "0.2s"
    }
    const nebulaBottomButtonStyle = U(() => ({
      ...bottomButtonStyle,
      background: mode === "nebula" ? "#ccc" : ""
    }))
    const relationBottomButtonStyle = U(() => ({
      ...bottomButtonStyle,
      background: mode === "relation" ? "#ccc" : ""
    }))
    return (
      div({inlineStyle:{width: "300px", display: "flex", flexDirection: "column"}})(either([{
        if: () => mode === "nebula",
        then: div({inlineStyle: {flexGrow: "1"}})(
          Repeat(
            NebulaSelectorSingle,
            () => context.selection.universe?.nebulaLocations.map(nl => ({nebula: nl.nebula})) ?? []
          )
        )
      }, {
        if: () => mode === "relation",
        then: div({inlineStyle: {flexGrow: "1"}})(
          Repeat(
            RelationSelectorSingle,
            () => context.selection.universe?.relations.map(r => ({relation: r})) ?? []
          )
        )
      }, {
        if: () => true,
        then: div({inlineStyle: {width: "100%"}})([
          btn({onclick: () => mode = 'nebula', inlineStyle: nebulaBottomButtonStyle, className: "hover-ccc"})("Nebula"),
          btn({onclick: () => mode = 'relation', inlineStyle: relationBottomButtonStyle, className: "hover-ccc"})("Relation")
        ])
      }]))
    )
  }