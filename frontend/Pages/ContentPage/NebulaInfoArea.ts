import { TreeNode } from "@/data-structure/tree";
import { U } from "@/engine";
import { div, btn } from "@/funcObject";
import { Nebula } from "../../../backend/data/Data";
import context from "../../context";
import { splitIntoPieces } from "../../utils/utils";

export function NebulaInfoArea(){
    function getConnectedNebulas(){
        if (!context.selection.content) return [];
        return [
            context.data.systemUniverse.nebulaLocations[0].nebula,
            ...context.data.nebulas.filter(n => n.tree.nodes.some(nd => nd.data === context.selection.content))
        ]
    }
    function getUniverseFrom(nebula:Nebula){
        const univ = context.data.universes.find(u => !!u.nebulaLocations.find(nl => nl.nebula === context.selection.nebula));
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
                    context.selection.universe = getUniverseFrom(context.selection.nebula) ?? context.data.systemUniverse;
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
                    context.selection.universe = getUniverseFrom(context.selection.nebula) ?? context.data.systemUniverse;
                }})(">"),
            ),
            btn({onclick: () => {
                if (!context.selection.content) return;
                context.selection.universe = context.data.systemUniverse;
                context.selection.nebula = context.data.addNebula(new Nebula({name: "제목없음"}))
                context.selection.nebula!.tree.insert(new TreeNode(context.selection.content))
            }})("현재 컨텐츠로 네뷸라 시작하기"),
            btn({
                onclick: async () => {
                    const content = context.selection.content;
                    if (!content) return;
                    const contents = context.data.contents.all().sort((a, b) => a.title.length > b.title.length ? -1 : 1);
                    // await new Promise<Content[]>(resolve => {
                    //     document.body.append(MentionSelector(resolve));
                    // })
                    for (const dust of content.dusts.traverse().map(i => i.node.data)){
                        for (const content of contents){
                            dust.claim = splitIntoPieces(dust.claim).map(p => {
                                if (p.kind === "text") return p.text.replaceAll(content.title, `[[${content.title}]]`);
                                else return p.text
                            }).join("")
                        }
                    }
                }
            })("언급 연결하기")
        )
    )
}