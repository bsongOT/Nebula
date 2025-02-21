import { div, button } from "@/funcObject";
import context from "../../context";

export function QueryButton(){
    return (
        div()(
            button({
                className: "button", 
                inlineStyle: {
                    webkitTextStroke: "1.5px black",
                    fontWeight: "1000",
                    color: "white",
                    fontSize: "30px",
                },
                onclick: () => {
                    context.popupPage = "query"
                }
            })("Q")
        )
    )
}