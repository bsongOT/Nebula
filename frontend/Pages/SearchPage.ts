import { Repeat, U, Updated } from "@/engine";
import { Attribute, div, hr, tr } from "@/funcObject";
import context from "../context";
import { Content, Nebula } from "../../backend/data/Data";
import { hangulSeperate } from "@/utils/utils";
import { Universe } from "../../backend/data/components/Universe";

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
    const containerStyle:Attribute<"div">["inlineStyle"] = U(() => ({
        display: context.searching ? "flex" : "none",
        position: "fixed",
        top: "0",
        left: "0",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backdropFilter: "blur(5px) brightness(80%)"
    }))
    const style:Partial<HTMLElement["style"]>= {
        display: "flex",
        height: "calc(90% - 104px)",
        width: "80%",
        translate: "0 94px",
        flexDirection: "column",
        overflowY: "auto",
        background: "white",
        boxShadow: "2px 2px 4px #ccc",
        borderRadius: "10px"
    }

    document.addEventListener("keydown", e => {
        if (!context.searching) return;
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
        div({inlineStyle: containerStyle, onclick: () => {context.searching = false}})(
            div({inlineStyle: style, onclick: e => e.stopPropagation()})(
                div({inlineStyle: U(() => ({
                    padding: "5px",
                    display: (searchedList.length === 0) ? "" : "none"
                }))})(
                    div()("생성"),
                    div({inlineStyle: {paddingLeft: "5px"}})(
                        div({inlineStyle: U(() => ({background: context.searchIndex === 0 ? "#ccc" : ""}))})(() => `컨텐츠(${context.searchString}) 생성`),
                        div({inlineStyle: U(() => ({background: context.searchIndex === 1 ? "#ccc" : ""}))})(() => `네뷸라(${context.searchString}) 생성`),
                        div({inlineStyle: U(() => ({background: context.searchIndex === 2 ? "#ccc" : ""}))})(() => `유니버스(${context.searchString}) 생성`)
                    ),
                    hr()(),
                ),
                div({inlineStyle: {padding: "5px"}})(
                    div()("컨텐츠"),
                    div({inlineStyle: {paddingLeft: "5px"}})(
                        Repeat(
                            i => div({inlineStyle: U(() => ({background: context.searchIndex === i.index ? "#ccc" : ""}))})(() => i.content.title),
                            () => {
                                searchedList.contents = context.data.contents.filter(c => hangulSeperate(c.title).includes(hangulSeperate(context.searchString)))
                                return searchedList.contents.map((content, index) => ({content, index})).slice(0, upperLength);
                            }
                        )
                    )
                ),
                div({inlineStyle: {padding: "5px"}})(
                    div()("네뷸라"),
                    div({inlineStyle: {paddingLeft: "5px"}})(
                        Repeat(
                            i => div({inlineStyle: U(() => ({background: context.searchIndex === i.index ? "#ccc" : ""}))})(() => i.nebula.name),
                            () => {
                                searchedList.nebulas = context.data.nebulas.filter(n => hangulSeperate(n.name).includes(hangulSeperate(context.searchString)))
                                return searchedList.nebulas.map((nebula, i) => ({nebula, index: i + upperLength})).slice(0, upperLength);
                            }
                        )
                    )
                ),
                div({inlineStyle: {padding: "5px"}})(
                    div()("유니버스"),
                    div({inlineStyle: {paddingLeft: "5px"}})(
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