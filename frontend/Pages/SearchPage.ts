import { Repeat, U, Updated } from "@/engine";
import { Attribute, div, hr, inputText, span, tr } from "@/funcObject";
import context from "../context";
import { Content, Nebula } from "../../backend/data/Data";
import { hangulSeperate } from "@/utils/utils";
import { Universe } from "../../backend/data/components/Universe";
import { LucideIcon } from "../Components/utils/Icon";
import { Boxes, Network, NotebookText } from "lucide";

export function SearchPage(){
    const upperLength = 5;
    let searchedList = {
        contents: new Array<Content>(),
        nebulas: new Array<Nebula>(),
        universes: new Array<Universe>(),
        get totalList(){
            if (this.dataLength === 0){
                return [{
                    action: "add-content"
                }]
            }
            return [...this.contents, ...this.nebulas, ...this.universes]
        },
        get length(){
            if (this.dataLength === 0) return 1;
            return this.dataLength; 
        },
        get dataLength(){
            return this.contents.length + this.nebulas.length + this.universes.length; 
        }
    }
    const style:Partial<HTMLElement["style"]>= {
        height: "90%",
        width: "80%",
        flexDirection: "column",
        overflowY: "auto"
    }

    document.addEventListener("keydown", e => {
        if (context.popupPage !== "search") return;
        if (e.code === "ArrowDown"){
            context.searchIndex++;
            context.searchIndex %= searchedList.length;
        }
        else if (e.code === "ArrowUp"){
            context.searchIndex--;
            context.searchIndex = (context.searchIndex + searchedList.length) % searchedList.length;
        }
    })
    return (
        div({
            class: "popup-page-wrapper",
            inlineStyle: U(() => ({
                display: context.popupPage === "search" ? "" : "none",
            })), 
            onclick: () => {context.popupPage = ""}
        })(
            div({class: "popup-page", inlineStyle: style, onclick: e => e.stopPropagation()})(
                SearchBar({get current(){ return searchedList.totalList[context.searchIndex]}}),
                div({inlineStyle: U(() => ({ display: (searchedList.dataLength === 0) ? "" : "none" }))})(
                    div({class: "search-header-item"})("생성"),
                    div()(
                        div({class: "search-item", inlineStyle: U(() => ({background: context.searchIndex === 0 ? "#eee" : ""}))})(() => `컨텐츠(${context.searchString}) 생성`),
                    ),
                    hr()()
                ),
                div()(
                    div({class: "search-header-item"})("컨텐츠"),
                    div()(
                        Repeat(
                            SearchContentItem,
                            () => {
                                searchedList.contents = context.data.contents.filter(c => hangulSeperate(c.title).includes(hangulSeperate(context.searchString))).slice(0, upperLength);
                                return searchedList.contents.map((content, index) => ({content, index}));
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
                                searchedList.nebulas = [context.data.systemUniverse.dayNebula, ...context.data.nebulas.all()].filter(n => hangulSeperate(n.name).includes(hangulSeperate(context.searchString))).slice(0, upperLength)
                                return searchedList.nebulas.map((nebula, i) => ({nebula, index: i + searchedList.contents.length}));
                            }
                        )
                    )
                ),
                div()(
                    div({class: "search-header-item"})("유니버스"),
                    div()(
                        Repeat(
                            SearchUniverseItem,
                            () => {
                                searchedList.universes = [context.data.systemUniverse, ...context.data.universes.all()].filter(u => hangulSeperate(u.name).includes(hangulSeperate(context.searchString))).slice(0, upperLength)
                                return searchedList.universes.map((universe, i) => ({universe, index: i + searchedList.contents.length + searchedList.nebulas.length}));
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
function SearchUniverseItem(info:{universe:Universe, index:number}){
    return (
        div({
            class: "search-item",
            inlineStyle: U(() => ({background: context.searchIndex === info.index ? "#eee" : ""}))
        })(
            span({class: "search-item-icon"})(LucideIcon(Boxes)),
            span()(() => info.universe.name)
        )
    )
}
function SearchBar(info:{current:{action:string} | Content | Nebula | Universe}){
    let focused = false;
    return (
        div({ class: "search-bar" })(
            span({ class: "icon material-symbols-outlined" })("search"),
            inputText({
                class: U(text => {
                    if (!focused) text.focus();
                    return "";
                }),
                onfocus: () => focused = true,
                onblur: () => focused = false,
                onkeydown: e => {
                    if (e.code === "ArrowDown" || e.code === "ArrowUp" || e.code === "Tab") e.preventDefault()
                },
                onkeyup: function (e) {
                    const text = <HTMLInputElement>this;
                    if (e.code === 'Enter') {
                        if (info.current instanceof Content){
                            context.selection.universe = context.data.systemUniverse;
                            context.selection.nebula = context.data.systemUniverse.dayNebula;
                            context.selection.content = context.data.systemUniverse.dayNebula.tree.traverse().find(i => i.node.data === info.current)?.node;
                            context.popupPage = "";
                        }
                        else if (info.current instanceof Nebula) {
                            const neb = info.current
                            context.selection.universe = context.data.universes.find(u => u.nebulas.includes(neb));
                            context.selection.nebula = neb;
                            context.selection.content = undefined;
                            context.popupPage = "";
                        }
                        else if (info.current instanceof Universe){
                            context.selection.universe = info.current;
                            context.selection.nebula = undefined;
                            context.selection.content = undefined;
                            context.popupPage = "";
                        }
                        else if (info.current.action === "add-content"){
                            if (text.value.trim() === "") return;
                            context.data.addContent(new Content({ title: text.value }));
                            text.value = '';
                            context.searchString = '';
                            if (!e.shiftKey) {
                                context.popupPage = "";
                            }
                        }
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