import { TreeNode } from "@/data-structure/tree";
import { U } from "@/engine";
import { div, btn } from "@/funcObject";
import { Content, Nebula } from "../../../backend/data/Data";
import context from "../../context";
import { receiveMessage, splitIntoPieces } from "../../utils/utils";

export function NebulaInfoArea(){
    function getConnectedNebulas(){
        if (!context.selection.content) return [];
        return [
            context.data.systemUniverse.dayNebula,
            ...context.data.nebulas.filter(n => n.tree.traverse().some(i => i.node.data === context.selection.content?.data))
        ]
    }
    function getUniverseFrom(nebula:Nebula){
        const univ = context.data.universes.find(u => u.nebulas.includes(nebula));
        if (univ) return univ;
        if (nebula.id < 0) return context.data.systemUniverse;
        return;
    }
    return (
        div()(
            div({inlineStyle: {display: "flex", fontSize: "20px", alignItems: "center"}})(
                div({className: "circle-button hover-skyblue", inlineStyle: {marginRight: "15px", color: "coral"}, onclick: () => {
                    const connectedNebulas = getConnectedNebulas();
                    context.selection.nebula = connectedNebulas[connectedNebulas.indexOf(context.selection.nebula!) - 1] ?? context.selection.nebula;
                    context.selection.universe = getUniverseFrom(context.selection.nebula) ?? context.data.isolatedUniverse;
                }})("<"),
                div({inlineStyle: U(() => ({
                    display: "flex",
                    border: "5px solid",
                    transition: "0.1s",
                    borderColor: context.isRecordingContent ? "red" : "#ffffff00"
                })),
                    onclick: () => context.isRecordingContent = !context.isRecordingContent
                })(
                    div()(() => context.selection.nebula?.name ?? ""),
                    div({inlineStyle: {marginLeft: "5px", color: "#aaa", fontSize: "17px"}})(() => `(${getConnectedNebulas().indexOf(context.selection.nebula!) + 1}/${getConnectedNebulas().length})`),
                ),
                div({className: "circle-button hover-skyblue", inlineStyle: {marginLeft: "15px", color: "coral"}, onclick: () => {
                    const connectedNebulas = getConnectedNebulas();
                    context.selection.nebula = connectedNebulas[connectedNebulas.indexOf(context.selection.nebula!) + 1] ?? context.selection.nebula;
                    context.selection.universe = getUniverseFrom(context.selection.nebula) ?? context.data.isolatedUniverse;
                }})(">"),
            )
        )
    )
}