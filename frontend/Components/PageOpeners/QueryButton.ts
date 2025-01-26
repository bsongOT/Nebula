import { div, button } from "@/funcObject";

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
                }
            })("Q")
        )
    )
}