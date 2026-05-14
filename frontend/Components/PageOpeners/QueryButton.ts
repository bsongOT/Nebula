import { div, button } from "@/funcObject";
import context from "../../context";

export function QueryButton(){
    return (
        div()(
            button({
                className: "button query-button", 
                onclick: () => {
                    context.popupPage = "query"
                }
            })("Q")
        )
    )
}