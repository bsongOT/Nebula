import { U } from "@/engine";
import { Attribute, div, h2 } from "@/funcObject";
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
                )
            )
        )
    )
}