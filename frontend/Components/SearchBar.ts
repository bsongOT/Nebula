import { div, span, inputText } from "@/funcObject";
import { Content } from "../../backend/data/Data";
import context from "../context";
import { U } from "@/engine";

export function SearchBar(){
    let focused = false;
    return (
        div({ class: "search-bar", inlineStyle: U(() => ({ zIndex: context.searching ? "1" : "" })) })(
            span({ class: "material-symbols-outlined" })("search"),
            inputText({
                onfocus: () => {
                    focused = true;
                    context.searching = true;
                },
                onblur: () => focused = false,
                onkeydown: e => {
                    if (e.code === "ArrowDown" || e.code === "ArrowUp") e.preventDefault()
                },
                onkeyup: function (e) {
                    const text = <HTMLInputElement>this;
                    if (e.code === 'Enter') {
                        if (text.value.trim() === "") return;
                        context.data.addContent(new Content({ title: text.value }));
                        text.value = '';
                        context.searchString = '';
                    }
                },
                value: U(text => {
                    if (context.searching) {
                        if (!focused) text.focus();
                        return text.value;
                    }
                    text.blur();
                    return "";
                }),
                oninput: function () {
                    context.searchString = (this as HTMLInputElement).value;
                    context.searchIndex = 0;
                },
                placeholder: "검색 또는 컨텐츠 추가",
                inlineStyle: { flexGrow: "1" }
            })()
        )
    )
}