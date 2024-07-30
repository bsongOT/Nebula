import { div, inputText, li, textarea, ul } from "@/funcObject"
import context from "../../context"
import { ListSelector } from "../../ListSelector/ListSelector"
import { DataComponent } from "../../data/components/DataComponent"
import { Content } from "../../data/Data"
import { Repeat, U } from "@/engine"
import "./ContentPage.css"
import { Dust } from "../../data/components/Dust"
import { TreeNode } from "@/data-structure/tree"

function ContentToolBox(){
    return (
        div({ class: "content-tool-box" })([
            div({ class: "view-mode-tool-box" })([
                div()("편집"),
                div()("칸반"),
                div()("페이지"), // [1][2][3][4][5]...
                div()("문서") // 커널 띄우기 가능
            ]),
            div({ class: "useful-tool-box" })([
                div()("Relation"),
                div()("Parents"),
                div()("Children"),
                div()("Nebula"),
                div()("Appearance")
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
function DustBlock(info:{dustNode:TreeNode<Dust>}){
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
                    if ((<KeyboardEvent>e).code === "Enter"){
                        e.preventDefault()
                        if (!context.selection.content) return;
                        const newDust = new TreeNode(context.selection.content.dusts, context.data.dusts.add(new Dust()));
                        context.selection.content.dusts.insertAsRightFriend(info.dustNode,newDust)
                        focusedDust = newDust.data;
                    }
                    if ((<KeyboardEvent>e).code === "Backspace"){
                        if (info.dustNode.data.claim !== "") return;
                        focusedDust = info.dustNode.leftFriend?.data;
                        context.selection.content?.dusts.remove(info.dustNode);
                        context.data.dusts.remove(info.dustNode.data.id);
                        (<HTMLElement>e.target).blur();
                    }
                },
                onclick: e => {
                    focusedDust = info.dustNode.data;
                },
                onblur: () => isFocused = false,
                inlineStyle: {
                    height: '20px'
                },
                value: U(ta => {
                    if (focusedDust === info.dustNode.data) ta.focus();
                    if (isFocused) return ta.value;
                    return info.dustNode.data.claim;
                })
            })(),

        ])
    )
}
export const ContentEditor = () => {
    let isTitleFocused = false;
    let viewMode = "edit";
    let toolMode = "none";
    return (
        div({ class: "content-page" })([
            ContentToolBox(),
            inputText({
                className: "content-title",
                value: U((text) => {
                    if (isTitleFocused) return text.value;
                    return context.selection.content?.title ?? ""
                }),
                oninput: e => {
                    isTitleFocused = true;
                    if (!context.selection.content) return;
                    context.selection.content.title = (<HTMLInputElement>e.target).value;
                },
                onblur: () => {
                    isTitleFocused = false;
                }
            })(),
            ul()(Repeat(DustBlock, () => {
                const content = context.selection.content
                if (content === undefined) return [];
                if (content.dusts.root.children.length === 0) {
                    content.dusts.insert(new TreeNode(content.dusts, context.data.dusts.add(new Dust())))
                }
                return content.dusts.root.children;
            }, tnd => ({dustNode:tnd})))
        ])
    )
}