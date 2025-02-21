import { Repeat, U, Updated } from "@/engine";
import { Attribute, div, hr, inputText, span, tr } from "@/funcObject";
import context from "../context";
import { Content, Nebula } from "../../backend/data/Data";
import { hangulSeperate } from "@/utils/utils";
import { Universe } from "../../backend/data/components/Universe";
import { LucideIcon } from "../Components/utils/Icon";
import { Network, NotebookText } from "lucide";

export function SearchPage(){
    const upperLength = 5;
    let searchedList = {
        contents: new Array<Content>(),
        nebulas: new Array<Nebula>(),
        universes: new Array<Universe>(),
        get length(){ 
            return this.contents.length + this.nebulas.length + this.universes.length;
        },
        get displayedLength(){
            return Math.min(this.contents.length, upperLength) + Math.min(this.nebulas.length, upperLength) + Math.min(this.universes.length, upperLength);
        }
    }
    const style:Partial<HTMLElement["style"]>= {
        display: "flex",
        height: "90%",
        width: "80%",
        flexDirection: "column",
        overflowY: "auto",
        background: "white",
        boxShadow: "2px 2px 4px #ccc",
        borderRadius: "10px"
    }

    document.addEventListener("keydown", e => {
        if (context.popupPage !== "search") return;
        if (e.code === "ArrowDown"){
            context.searchIndex++;
            if (searchedList.length === 0) context.searchIndex %= 3;
            else context.searchIndex %= searchedList.displayedLength;
        }
        else if (e.code === "ArrowUp"){
            context.searchIndex--;
            if (searchedList.length === 0) context.searchIndex = (context.searchIndex + 3) % 3;
            else context.searchIndex = (context.searchIndex + searchedList.displayedLength) % searchedList.displayedLength;
        }
    })
    return (
        div({
            class: "popup-page-wrapper",
            inlineStyle: U(() => ({
                display: context.popupPage === "search" ? "flex" : "none",
            })), 
            onclick: () => {context.popupPage = ""}
        })(
            div({class: "popup-page", inlineStyle: style, onclick: e => e.stopPropagation()})(
                SearchBar(),
                div({inlineStyle: U(() => ({ display: (searchedList.length === 0) ? "" : "none" }))})(
                    div({class: "search-header-item"})("생성"),
                    div()(
                        div({class: "search-item", inlineStyle: U(() => ({background: context.searchIndex === 0 ? "#eee" : ""}))})(() => `컨텐츠(${context.searchString}) 생성`),
                        div({class: "search-item", inlineStyle: U(() => ({background: context.searchIndex === 1 ? "#eee" : ""}))})(() => `네뷸라(${context.searchString}) 생성`),
                        div({class: "search-item", inlineStyle: U(() => ({background: context.searchIndex === 2 ? "#eee" : ""}))})(() => `유니버스(${context.searchString}) 생성`)
                    ),
                    hr()(),
                ),
                div()(
                    div({class: "search-header-item"})("컨텐츠"),
                    div()(
                        Repeat(
                            SearchContentItem,
                            () => {
                                searchedList.contents = context.data.contents.filter(c => hangulSeperate(c.title).includes(hangulSeperate(context.searchString)))
                                return searchedList.contents.map((content, index) => ({content, index})).slice(0, upperLength);
                            }
                        )
                    )
                ),
                div()(
                    div({class: "search-header-item"})("네뷸라"),
                    div()(
                        Repeat(
                            SearchNebulaItem,
                            () => {
                                searchedList.nebulas = context.data.nebulas.filter(n => hangulSeperate(n.name).includes(hangulSeperate(context.searchString)))
                                return searchedList.nebulas.map((nebula, i) => ({nebula, index: i + upperLength})).slice(0, upperLength);
                            }
                        )
                    )
                ),
                div()(
                    div({class: "search-header-item"})("유니버스"),
                    div()(
                        Repeat(
                            i => div()(() => i.universe.name),
                            () => {
                                searchedList.universes = context.data.universes.filter(u => hangulSeperate(u.name).includes(hangulSeperate(context.searchString)))
                                return searchedList.universes.map(universe => ({universe})).slice(0, upperLength);
                            }
                        )
                    )
                ),
            )
        )
    )
}
function SearchContentItem(info:{content:Content, index:number}){
    return (
        div({
            class: "search-item", 
            inlineStyle: U(() => ({background: context.searchIndex === info.index ? "#eee" : ""}))
        })(
            span({class: "search-item-icon"})(LucideIcon(NotebookText)),
            span()(() => info.content.title)
        )
    )
}
function SearchNebulaItem(info:{nebula:Nebula, index:number}){
    return (
        div({
            class: "search-item",
            inlineStyle: U(() => ({background: context.searchIndex === info.index ? "#eee" : ""}))
        })(
            span({class: "search-item-icon"})(LucideIcon(Network)),
            span()(() => info.nebula.name)
        )
    )
}
function SearchBar(){
    return (
        div({ class: "search-bar" })(
            span({ class: "icon material-symbols-outlined" })("search"),
            inputText({
                onkeydown: e => {
                    if (e.code === "ArrowDown" || e.code === "ArrowUp" || e.code === "Tab") e.preventDefault()
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