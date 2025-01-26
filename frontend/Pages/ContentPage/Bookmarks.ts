import { U } from "@/engine"
import { div } from "@/funcObject"
import context from "../../context"

export function Bookmarks(){
    const style:Partial<HTMLElement["style"]> = {
        position: "absolute",
        right: "-45px"
    }
    const bookmarkStyle:Partial<HTMLElement["style"]> = {
        width: "60px",
        height: "30px",
        verticalAlign: "middle",
        lineHeight: "30px",
        background: "#ccc",
        paddingLeft: "10px",
        borderRadius: "10px 0 0 10px",
        marginBottom: "5px",
        transition: "0.2s"
    }
    return (
        div({ class: "content-tool-box", inlineStyle: style})(
            div({ 
                className: U(() => context.contentPage.viewMode === "edit" ? "selected" : ""),
                onclick: () => context.contentPage.viewMode = "edit",
                inlineStyle: bookmarkStyle
            })("편집"),
            div({ 
                className: U(() => context.contentPage.viewMode === "kanban" ? "selected" : ""),
                onclick: () => context.contentPage.viewMode = "kanban",
                inlineStyle: bookmarkStyle
            })("칸반")
        )
    )
}