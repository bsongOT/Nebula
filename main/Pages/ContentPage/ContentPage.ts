import { div, inputText, li, span, textarea, ul } from "@/funcObject"
import context from "../../context"
import { Content } from "../../data/Data"
import { engine, Repeat, U } from "@/engine"
import "./ContentPage.css"
import { Dust } from "../../data/components/Dust"
import { Tree, TreeNode } from "@/data-structure/tree"
import { treeLeafs } from "../.."
import { Relation } from "../../data/components/Relation"

function ContentToolBox(){
    let toolMode = "none";
    return (
        div({ 
            class: "content-tool-box",
            inlineStyle: U(() => ({
                display: context.contentPage.viewMode === "kanban" ? "flex" : ""
            }))
        })([
            div({ class: "view-mode-tool-box" })([
                div({ 
                    className: U(() => context.contentPage.viewMode === "edit" ? "selected" : ""),
                    onclick: () => context.contentPage.viewMode = "edit"
                })("편집"),
                div({ 
                    className: U(() => context.contentPage.viewMode === "kanban" ? "selected" : ""),
                    onclick: () => context.contentPage.viewMode = "kanban"
                })("칸반"),
                div({ 
                    className: U(() => context.contentPage.viewMode === "page" ? "selected" : ""),
                    onclick: () => context.contentPage.viewMode = "page"
                })("페이지"), // [1][2][3][4][5]...
                div({ 
                    className: U(() => context.contentPage.viewMode === "document" ? "selected" : ""),
                    onclick: () => context.contentPage.viewMode = "document"
                })("문서") // 커널 띄우기 가능
            ])
        ])
    )
}
function RelationList(){
    return (
        div()()
    )
}
let focusedDust = undefined as Dust | undefined;
function DustBlock(info:{dustNode:TreeNode<Dust>}):HTMLLIElement{
    let isFocused = false;

    return (
        li()([
            textarea({
                onchange: e => {
                    const me = e.target as HTMLTextAreaElement;
                    me.style.height = '0';
                    me.style.height = me.scrollHeight + "px";
                    info.dustNode.data.claim = me.value;
                },
                oninput: e => {
                    const me = e.target as HTMLTextAreaElement;
                    me.style.height = '0';
                    me.style.height = me.scrollHeight + "px";
                    info.dustNode.data.claim = me.value;
                    isFocused = true;
                },
                onkeydown: e => {
                    if (!e.shiftKey && e.code === "Enter"){
                        e.preventDefault()
                        if (!context.selection.content) return;
                        const newDust = new TreeNode(context.selection.content.dusts, context.data.dusts.add(new Dust()));
                        context.selection.content.dusts.insertAsRightFriend(info.dustNode,newDust)
                        focusedDust = newDust.data;
                    }
                    if (e.code === "Backspace"){
                        if (info.dustNode.data.claim !== "") return;
                        focusedDust = info.dustNode.leftFriend?.data ?? info.dustNode.parent?.data;
                        context.selection.content?.dusts.remove(info.dustNode);
                        context.data.dusts.remove(info.dustNode.data.id);
                        (<HTMLElement>e.target).blur();
                    }
                    if (e.code === "Tab"){
                        e.preventDefault();
                        if (e.shiftKey){
                            const parent = info.dustNode.parent;
                            if (!parent || parent === info.dustNode.tree.root) return;
                            info.dustNode.tree.insertAsRightFriend(parent, info.dustNode)
                        }
                        else {
                            const left = info.dustNode.leftFriend;
                            if (!left) return;
                            info.dustNode.tree.insert(info.dustNode, left);
                        }
                    }
                },
                onfocus: () => {
                    focusedDust = info.dustNode.data;
                    isFocused = true;
                },
                onblur: () => {
                    if (focusedDust === info.dustNode.data) focusedDust = undefined;
                    isFocused = false
                },
                inlineStyle: U((ta) => {
                    ta.style.height = '0';
                    return {
                        height: ta.scrollHeight + "px"
                    }
                }),
                value: U(ta => {
                    if (focusedDust === info.dustNode.data && !isFocused) ta.focus()
                    if (isFocused) return ta.value;
                    return info.dustNode.data.claim;
                })
            })()
        ])
    )
}
function ContentTitle(){
    let isTitleFocused = false;
    return (
        inputText({
            className: "title",
            value: U((text) => {
                if (isTitleFocused) return text.value;
                return context.selection.content?.title ?? ""
            }),
            inlineStyle: U((text) => {
                text.style.width = '0'
                text.style.width = 'auto'
                return {
                    width: `${text.scrollWidth}px`
                }
            }),
            size: 1,
            oninput: e => {
                isTitleFocused = true;
                if (!context.selection.content) return;
                context.selection.content.title = (<HTMLInputElement>e.target).value;
            },
            onblur: () => {
                isTitleFocused = false;
            }
        })()
    )
}
export function ContentsHome(){
    return (
        div({ className: "content-creator" })([
            inputText({value: "", placeholder: "컨텐트 추가 또는 검색", onkeyup: e => {
                if (e.code === "Enter"){
                    const val = (<HTMLInputElement>e.target).value;
                    if (val.trim() === '') return;
                    context.data.addContent(new Content({title: val}));
                    (<HTMLInputElement>e.target).value = "";
                }
            }})(),
            ul({inlineStyle: {display:"flex", flexDirection: "column-reverse"}})(Repeat(
                i => li()(() => i.content.title),
                () => context.data.contents.map(c => ({content: c}))
            ))
        ])
    )
}
export function RelationDust(info:{relation:Relation, main:Content, second:Content}){
    let isInputting = false;
    return (
        ul({inlineStyle: {listStyle: "disc"}})([
            li()([
                span({
                    class: "relation-dust-title",
                    onclick: () => {
                        context.selection.nebula = context.selection.content === info.main ? info.relation.secondTree : info.relation.mainTree;
                        context.selection.content = context.selection.content === info.main ? info.second : info.main
                    }
                })(() => context.selection.content === info.main ? info.second.title : info.main.title)
            ]),
            li({inlineStyle: {marginLeft: "20px"}})([
                inputText({
                    value: U(text => {
                        if (isInputting) return text.value;
                        const cell = info.relation.table.find(i => i.main === info.main && i.second === info.second)?.state;
                        if (!cell) return '';
                        if (typeof cell === 'number') return "";
                        return cell.claim;
                    }),
                    inlineStyle: {
                        width: "100%",
                        outline: "none",
                        border: "none"
                    },
                    oninput: e => {
                        const text = <HTMLInputElement>e.target;
                        const cell = info.relation.table.find(i => i.main === info.main && i.second === info.second);
                        const realCell = cell ?? {
                            main: info.main,
                            second: info.second,
                            state: new Dust({claim: text.value})
                        }
                        if (!cell) info.relation.table.push(realCell);
                        if (typeof realCell.state === 'number'){
                            realCell.state = context.data.dusts.add(new Dust({claim: text.value}))
                            return;
                        }
                        realCell.state.claim = text.value;
                    },
                    onfocus: () => {
                        isInputting = true;
                    },
                    onblur: () => {
                        isInputting = false;
                    }
                })()
            ])
        ])
    )
}
export function RelationDustSingle(info:{relation:Relation, opponent:Content[], from:"main"|"second"}){
    return (
        li({inlineStyle: {listStyle: "none"}})([
            div({inlineStyle: {display: "flex", alignItems: "center", marginLeft: "10px"}})([
                div({inlineStyle: {height: "2px", width: "10px", background: "black"}})(),
                div({inlineStyle: {margin: "0 3px"}})(() => info.from === 'main' ? info.relation.secondTree.name : info.relation.mainTree.name),
                div({inlineStyle: {height: "2px", flexGrow: "1", background: "black"}})(),
            ]),
            ul({inlineStyle: {padding: "0"}})(Repeat(RelationDust, () => context.selection.content ? info.opponent.map(c => ({
                relation: info.relation,
                main: info.from === 'main' ? context.selection.content! : c,
                second: info.from === 'main' ? c : context.selection.content!
            })) : []))
        ])
    )
}
export function RelationDustSet(){
    const has = <T>(tree:Tree<T>, data:T) => tree.nodes.find(n => n.data === data);
    return (
        ul({inlineStyle: {padding: "0", margin: "0"}})(
            Repeat(RelationDustSingle,
            () => {
                if (!context.selection.content) return [];

                const rels1 = context.data.relations.filter(r => !!has(r.mainTree.tree, context.selection.content!));
                const rels2 = context.data.relations.filter(r => !!has(r.secondTree.tree, context.selection.content!));
                return [
                    ...rels1.map(r => ({
                        relation: r,
                        opponent: treeLeafs(r.secondTree.tree).map(n => n.data),
                        from: "main" as "main" | "second"
                    })),
                    ...rels2.map(r => ({
                        relation: r,
                        opponent: treeLeafs(r.mainTree.tree).map(n => n.data),
                        from: "second" as "main" | "second"
                    }))
                ]
            }
        ))
    )
}
export function NebulaInfoArea(){
    return (
        div({inlineStyle: {display: "flex", flexDirection: "column"}})([
            div()(() => context.selection.nebula?.name ?? ""),
            div({inlineStyle: {display: "flex"}})([
                div()("<"),
                div()(Repeat(
                    i => div()(() => i.content.title),
                    () => {
                        if (!context.selection.content) return [];
                        return (
                            context.data.nebulas
                                .map(n => n.tree.nodes
                                    .find(nd => nd.children.find(c => c.data === context.selection.content)))
                                .filter(d => d && d.data)
                                .map(tn => ({content: tn!.data}))
                        )
                    }
                )),
                div()(() => context.selection.content?.title ?? ""),
                div()(Repeat(
                    i => div()(() => i.content.title),
                    () => {
                        return (
                            context.selection.nebula?.tree.nodes
                                .find(n => n.data === context.selection.content)?.children
                                .map(nd => ({content: nd.data})) ?? []
                        )
                    }
                )),
                div()(">")
            ]),
            div()(() => `${context.data.nebulas.filter(n => n.tree.nodes.some(nd => nd.data === context.selection.content)).indexOf(context.selection.nebula!) + 1}/${context.data.nebulas.filter(n => n.tree.nodes.some(nd => nd.data === context.selection.content)).length}`)
        ])
    )
}
export function ContentEditor(){
    const dustInfos = new Array<{
        dust:Dust,
        depth:number
    }>()
    engine.updater.register(() => {
        if (!context.selection.content) return;
        dustInfos.splice(0, dustInfos.length);
        dustInfos.push(...context.selection.content.dusts.traverse().map(i => ({dust: i.node.data, depth: i.depth})))
    })
    return (
        div({ class: "content-page" })(
            div({ className: U(() => `content-editor ${context.selection.content ? "" : "hidden"}`.trim())})(
                ContentToolBox(),
                ContentTitle(),
                NebulaInfoArea(),
                ul({inlineStyle: U(() => ({display: context.contentPage.viewMode === "kanban" ? "flex" : ""}))})(Repeat(DustBlock, () => {
                    const content = context.selection.content
                    if (content === undefined) return [];
                    if (content.dusts.root.children.length === 0) {
                        content.dusts.insert(new TreeNode(content.dusts, context.data.dusts.add(new Dust())))
                    }
                    return content.dusts.root.children.map(c => ({dustNode: c}));
                })),
                RelationDustSet()
            )
        )
    )
}