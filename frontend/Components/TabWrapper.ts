import { Repeat, U, Updated } from "@/engine";
import { div, span } from "@/funcObject";
import context, {Selection} from "../context";

export function TabWrapper() {
    const style:Updated<HTMLElement, Partial<HTMLElement["style"]>> = U(() => ({
        display: "flex",
        transition: "0.2s",
        translate: context.searching ? "30%" : ""
    }))

    return (
        div({ inlineStyle: style })(Repeat(Tab, () => context.tabs))
    )
}
function Tab(info: Selection) {
    return (
        div({
            className: U(() => context.selection === info || context.secondSelection === info ? "tab selected" : "tab"),
            inlineStyle: U(() => ({fontStyle: context.secondSelection === info ? "italic" : ""})),
            onclick: e => {
                if (e.metaKey || e.ctrlKey) {
                    if (context.selection === info) return;
                    context.screenSplit = true;
                    if (context.secondSelection === info) context.secondSelection = undefined;
                    else context.secondSelection = info;
                }
                else {
                    if (context.secondSelection === info) return;
                    context.selection = info;
                }
            }
        })([
            div()(() => info.content?.title ?? info.nebula?.name ?? info.universe?.name ?? "Home"),
            span({
                inlineStyle: {
                    marginLeft: "5px"
                }
            })("×")
        ])
    )
}
