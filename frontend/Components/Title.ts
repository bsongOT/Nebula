import { U } from "@/engine";
import { inputText } from "@/funcObject";
import context from "../context";

export function Title(info:{string:string}){
    return (
        inputText({
            className: "title",
            value: U((text) => {
                if (context.isTextFocused) return text.value;
                return info.string;
            }),
            inlineStyle: U((text) => {
                text.style.width = '0'
                text.style.width = 'auto'
                return {
                    width: `${text.scrollWidth}px`
                }
            }),
            size: 1,
            onblur: () => context.isTextFocused = false,
            onfocus: () => context.isTextFocused = true,
            oninput: function() {
                context.isTextFocused = true;
                info.string = (<HTMLInputElement>this).value;
            },
        })()
    )
}