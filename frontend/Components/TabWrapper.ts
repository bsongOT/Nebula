import { Repeat, U, Updated } from "@/engine";
import { div, span } from "@/funcObject";
import context, {Selection} from "../context";

export function TabWrapper() {
    const style:Updated<HTMLElement, Partial<HTMLElement["style"]>> = U(() => ({
        display: "flex",
        transition: "0.2s"
    }))

    return (
        div({ inlineStyle: style })(Repeat(Tab, () => context.tabs.map(selection => ({selection}))))
    )
}
function Tab(info: {selection:Selection}) {
    return (
        div({
            className: U(() => context.selection === info.selection ? "tab selected" : "tab"),
            onclick: () => {
                context.selection = info.selection;
            }
        })([
            div()(() => info.selection.content?.data.title ?? info.selection.nebula?.name ?? info.selection.universe?.name ?? "Home"),
            span({
                inlineStyle: {
                    marginLeft: "5px"
                },
                onclick: e => {
                    e.stopPropagation();
                    const index = context.tabs.indexOf(context.selection);
                    if (index >= 1){
                        context.selection = context.tabs[index - 1]
                        context.tabs.splice(index, 1)
                    }
                    else if (index === 0){
                        if (context.tabs.length <= 1){
                            const selection = {};
                            context.selection = selection;
                            context.tabs.splice(0, 1);
                            context.tabs.push(selection);
                        }
                        else {
                            context.selection = context.tabs[1];
                            context.tabs.splice(0, 1);
                        }
                    }
                }
            })("×")
        ])
    )
}
