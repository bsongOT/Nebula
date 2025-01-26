import { Attribute, button, div } from "@/funcObject";
import { Content } from "../../../backend/data/Data";

export function MentionSelector(resolve:(v:Content[])=>void){
    const attr:Attribute<"div"> = {
        inlineStyle: {
            position: "fixed",
            zIndex: "1",
            top: "50%",
            left: "50%",
            translate: "-50% -50%",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(10px) brightness(80%)"
        }
    }
    const selector = (
        div(attr)(
            div()(
                button({
                    onclick: () => {
                        resolve([]);
                        selector.remove()
                    }
                })("OK")
            )
        )
    )
    return selector
}