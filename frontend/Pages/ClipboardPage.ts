import { Repeat, U } from "@/engine";
import { Attribute, button, div, h2 } from "@/funcObject";
import context from "../context";

export function ClipboardPage(){
    let selectedOption = "content" as "content" | "nebula" | "universe";

    const style:Attribute<"div">["inlineStyle"] = U(() => ({ display: context.popupPage === "clipboard" ? "flex" : "none" }))
    const sideTitleStyle = {
        padding: "10px"
    }
    const sideMenuStyle = {
        padding: "5px 10px",
        borderRadius: "5px",
        transition: "0.2s"
    }
    return (
        div({class: "popup-page-wrapper", inlineStyle: style, onclick: () => context.popupPage = ""})(
            div({
                inlineStyle: {
                    width: "90%",
                    height: "90%",
                    background: "white",
                    filter: "drop-shadow(2px 2px 4px #aaa)",
                    borderRadius: "10px",
                    display: "flex",
                    overflow: "hidden"
                },
                onclick: e => e.stopPropagation()
            })(
                div({
                    inlineStyle: {
                        padding: "15px",
                        background: "dodgerblue"
                    }
                })(
                    h2({inlineStyle: sideTitleStyle})("클립보드"),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "content" ? "lavender" : ""})),
                        onclick: () => selectedOption = "content"
                    })("컨텐츠"),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "nebula" ? "lavender" : ""})),
                        onclick: () => selectedOption = "nebula"
                    })("네뷸라"),
                    div({
                        inlineStyle: U(() => ({...sideMenuStyle, background: selectedOption === "universe" ? "lavender" : ""})),
                        onclick: () => selectedOption = "universe"
                    })("유니버스")
                ),
                div({class: U(() => selectedOption === "content" ? "clipboard-page-main": "hidden")})(
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
                )
            ),
            div()(
                "관계 생성"
            )
        )
    )
}