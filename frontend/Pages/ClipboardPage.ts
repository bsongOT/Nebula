import { Repeat, U } from "@/engine";
import { Attribute, button, div, h2 } from "@/funcObject";
import context from "../context";

type ClipboardSelectedOption = "content" | "nebula" | "universe";
export function ClipboardPage(){
    let selectedOption = "content" as "content" | "nebula" | "universe";

    return (
        div({
            class: U(() => context.popupPage === "clipboard" ? "popup-page-wrapper" : "hidden"), 
            onclick: () => context.popupPage = ""
        })(
            div({
                class: "popup-page",
                onclick: e => e.stopPropagation()
            })(
                div({
                    inlineStyle: {
                        padding: "15px",
                        background: "dodgerblue"
                    }
                })(
                    h2({class: "popup-side-title"})("클립보드"),
                    div({
                        class: "popup-side-menu",
                        inlineStyle: U(() => ({background: selectedOption === "content" ? "lavender" : ""})),
                        onclick: () => selectedOption = "content"
                    })("컨텐츠"),
                    div({
                        class: "popup-side-menu",
                        inlineStyle: U(() => ({background: selectedOption === "nebula" ? "lavender" : ""})),
                        onclick: () => selectedOption = "nebula"
                    })("네뷸라"),
                    div({
                        class: "popup-side-menu",
                        inlineStyle: U(() => ({background: selectedOption === "universe" ? "lavender" : ""})),
                        onclick: () => selectedOption = "universe"
                    })("유니버스")
                ),
                
            div()(
                "관계 생성"
            )
        )
    ))
}
function ClipboardContentPage(info:{selectedOption:ClipboardSelectedOption}){
    return (
        div({class: U(() => info.selectedOption === "content" ? "clipboard-page-main": "hidden")})(
            div()("아직 미구현인 곳입니다. 여기에 컨텐츠를 담아서 네뷸라 구성에 쓸 수 있게 될 것임."),
            div()(
                button({
                    class: "one-click-button",
                    onclick: () => {
                        const content = context.selection.content;
                        if (!content) return;
                        if (context.clipboardLists.content.includes(content.data)) return;
                        context.clipboardLists.content.push(content.data);
                    }
                })("현재 컨텐츠 가져오기"),
                button({
                    class: "one-click-button",
                    onclick: () => {
                        const contents = context.selection.nebula?.tree.traverse().map(i => i.node.data) ?? [];
                        for (const content of contents){
                            if (content.id < 0) continue;
                            if (context.clipboardLists.content.includes(content)) continue;
                            context.clipboardLists.content.push(content);
                        }
                    }
                })("현재 네뷸라의 모든 컨텐츠 가져오기")
            ),
            div()(
                Repeat(
                    i => {
                        return div()(() => i.content.title)
                    },
                    () => context.clipboardLists.content.map(content => ({content}))
                )
            ),
            div()(
                button({
                    class: "one-click-button",
                    onclick: () => {
                        
                    }
                })("현재 네뷸라에 담기")
            )
        )
    )
}