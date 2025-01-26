import { Repeat, U, Updated } from "@/engine";
import { Attribute, div } from "@/funcObject";
import context from "../context";
import { Content, Nebula } from "../../backend/data/Data";
import { hangulSeperate } from "@/utils/utils";
import { Universe } from "../../backend/data/components/Universe";

export function SearchPage(){
    const style:Updated<HTMLElement, Partial<HTMLElement["style"]>> = U(() => ({
        display: context.searching ? "flex" : "none",
        gap: "10px",
        position: "fixed",
        top: "94px",
        left: "50%",
        translate: "-50%",
        height: "calc(100% - 104px)",
        width: "calc(100% - 20px)",
        justifyContent: "center"
    }))
    return (
        div({className: "search-page", inlineStyle: style})(
            ContentsAdder(),
            ContentsSearcher(),
            NebulasSearcher(),
            UniversesSearcher()
        )
    )
}
function ContentsAdder(){
    function gotoDayNebula(){
        context.searching = false;
        context.selection.universe = context.data.systemUniverse;
        context.selection.nebula = context.data.systemUniverse.dayNebula;
    }
    const attr:Attribute<"div"> = {
        inlineStyle: {
            width: "25%",
            maxWidth: "250px",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }
    }
    const titleAttr:Attribute<"div"> = {
        inlineStyle: {
            padding: "10px",
            background: "cornflowerblue",
            borderRadius: "10px",
            filter: "drop-shadow(2px 2px 4px #aaa)",
            marginBottom: "20px"
        }
    }
    const bodyAttr:Attribute<"div"> = {
        inlineStyle: {
            overflowY: "auto",
            flexGrow: "1",
            background: "white",
            borderRadius: "10px"
        }
    }

    return (
        div(attr)(
            div(titleAttr)("컨텐츠 추가"),
            div(bodyAttr)(
                div()(Repeat(ContentLine, () => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const todayTime = today.getTime()
                    return (
                        context.data.systemNebulas.day.add
                            .filter(i => i.day.getTime() >= todayTime)
                    )
                })),
                div({class: "hover-color-999", onclick: gotoDayNebula})("자세히 보기")
            )
        )
    )
}
function ContentLine(info:{content:Content}){
    return (
        div({
            className: "hover-ccc",
            inlineStyle: {
                padding: "5px"
            },
            onclick: () => {
                context.searching = false;
                context.selection.universe = context.data.systemUniverse;
                context.selection.nebula = context.data.systemUniverse.dayNebula;
                context.selection.content = info.content;
            }
        })(() => info.content.title)
    )
}
function ContentsSearcher(){
    const attr:Attribute<"div"> = {
        inlineStyle: {
            width: "25%",
            maxWidth: "250px",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }
    }
    const titleAttr:Attribute<"div"> = {
        inlineStyle: {
            padding: "10px",
            background: "darksalmon",
            borderRadius: "10px",
            filter: "drop-shadow(2px 2px 4px #aaa)",
            marginBottom: "20px"
        }
    }
    const bodyAttr:Attribute<"div"> = {
        inlineStyle: {
            overflowY: "auto",
            flexGrow: "1",
            background: "white",
            borderRadius: "10px"
        }
    }
    return (
        div(attr)(
            div(titleAttr)("컨텐츠 검색"),
            div(bodyAttr)(Repeat(ContentLine, () => (
                context.data.contents
                    .filter(c => hangulSeperate(c.title).includes(hangulSeperate(context.searchString)))
                    .map(content => ({content}))
            )))
        )
    )
}
function NebulasSearcher(){
    const attr:Attribute<"div"> = {
        inlineStyle: {
            width: "25%",
            maxWidth: "250px",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }
    }
    const titleAttr:Attribute<"div"> = {
        inlineStyle: {
            padding: "10px",
            background: "darksalmon",
            borderRadius: "10px",
            filter: "drop-shadow(2px 2px 4px #aaa)",
            marginBottom: "20px"
        }
    }
    const bodyAttr:Attribute<"div"> = {
        inlineStyle: {
            overflowY: "auto",
            flexGrow: "1",
            background: "white",
            borderRadius: "10px"
        }
    }
    return (
        div(attr)(
            div(titleAttr)("네뷸라 검색"),
            div(bodyAttr)(Repeat(NebulaLine, () => {
                return context.data.nebulas
                    .filter(n => hangulSeperate(n.name).includes(hangulSeperate(context.searchString)))
                    .map(nebula => ({nebula}))
            }))
        )
    )
}
function NebulaLine(info:{nebula:Nebula}){
    return (
        div({
            className: "hover-ccc",
            inlineStyle: {
                padding: "5px"
            },
            onclick: () => {
                context.searching = false;
                context.selection.universe = context.data.systemUniverse;
                context.selection.nebula = info.nebula;
                context.selection.content = undefined;
            }
        })(() => info.nebula.name)
    )
}
function UniversesSearcher(){
    const attr:Attribute<"div"> = {
        inlineStyle: {
            width: "25%",
            maxWidth: "250px",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }
    }
    const titleAttr:Attribute<"div"> = {
        inlineStyle: {
            padding: "10px",
            background: "darksalmon",
            borderRadius: "10px",
            filter: "drop-shadow(2px 2px 4px #aaa)",
            marginBottom: "20px"
        }
    }
    const bodyAttr:Attribute<"div"> = {
        inlineStyle: {
            overflowY: "auto",
            flexGrow: "1",
            background: "white",
            borderRadius: "10px"
        }
    }
    return (
        div(attr)(
            div(titleAttr)("유니버스 검색"),
            div(bodyAttr)(Repeat(UniverseLine, () => {
                return context.data.universes
                    .filter(u => hangulSeperate(u.name).includes(hangulSeperate(context.searchString)))
                    .map(universe => ({universe}))
            }))
        )
    )
}
function UniverseLine(info:{universe:Universe}){
    return (
        div({
            className: "hover-ccc",
            inlineStyle: {
                padding: "5px"
            },
            onclick: () => {
                context.searching = false;
                context.selection.universe = info.universe;
                context.selection.nebula = undefined;
                context.selection.content = undefined;
            }
        })(() => info.universe.name)
    )
}