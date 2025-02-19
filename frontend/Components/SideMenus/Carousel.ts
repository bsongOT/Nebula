import { U } from "@/engine";
import { Attribute, button, div, hr, span } from "@/funcObject";
import context from "../../context";
import { NestingList } from "./NestingList";
import { UniverseSelector } from "./UniverseSelector";
import { LucideIcon } from "../utils/Icon";
import { Network, NotebookText } from "lucide";

export function Carousel() {
    let mode = "nebula" as "nebula" | "content"
    const attr:Attribute<"div"> = {
        class: "row",
        inlineStyle: U(() => ({
            left: {
                nebula: "0",
                content: "-100%"
            }[mode]
        }))
    }
    const modeChangerAttr:Attribute<"div"> = {
        inlineStyle: {
            display: "flex",
            flexDirection: "column",
            padding: "5px 0"
        }
    }
    const modeButtonStyle:Attribute<"div">["inlineStyle"] = {
        padding: "5px 15px",
        margin: "2px 10px",
        borderRadius: "5px"
    }
    const nebulaModeButtonAttr:Attribute<"div"> = {
        className: "hover-eee", 
        onclick: () => mode = "nebula", 
        inlineStyle: U(() => ({
            background: mode === "nebula" ? "lightcoral" : "",
            ...modeButtonStyle
        }))
    }
    const contentModeButtonAttr:Attribute<"div"> = {
        className: "hover-eee", 
        onclick: () => mode = "content", 
        inlineStyle: U(() => ({
            background: mode === "content" ? "lightcoral" : "",
            ...modeButtonStyle
        }))
    }

    return (
        div({ class: "carousel" })(
            div(modeChangerAttr)(
                div(nebulaModeButtonAttr)(
                    span({ inlineStyle: {translate: "0 1px", display: "inline-block"} })(LucideIcon(Network)),
                    span({ inlineStyle: {marginLeft: "10px"} })("네뷸라")
                ),
                div(contentModeButtonAttr)(
                    span({ inlineStyle: {translate: "0 2px", display: "inline-block"} })(LucideIcon(NotebookText)),
                    span({ inlineStyle: {marginLeft: "10px"} })("컨텐츠")
                ),
                hr()()
            ),
            div(attr)(
                UniverseSelector(),
                NestingList()
            )
        )
    )
}