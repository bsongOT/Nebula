import { U, Repeat } from "@/engine";
import { Attribute, div } from "@/funcObject";
import context from "../../../context";

export function ContentDivisionLineContainer(info:{totalHeight:number, dustBlocks:HTMLElement[]}){
    const containerAttr:Attribute<"div"> = {
        inlineStyle: U(() => ({
            position: "relative",
            top: `calc(-${info.totalHeight}px - 15px + 0.5em)`,
            left: "calc(1em - 2.5px)",
            zIndex: "-1"
        }))
    }
    const getTransforms = () => {
        if (!context.selection.content) return [];
        const dustBlocks = info.dustBlocks;
        if (dustBlocks.length !== context.selection.content.data.dusts.length) return [];
        return (
            context.selection.content.data
                .dusts.traverse()
                .map((ii, index, arr) => {
                    return {
                        from: index,
                        to: arr.findIndex((ii2, index2) => ii2.depth <= ii.depth && index2 > index),
                        depth: ii.depth
                    }
                })
                .filter(ft => ft.from + 1 < ft.to || ft.to < 0)
                .map(ft => ({
                    from: dustBlocks[ft.from].style.top,
                    to: ft.to < 0 ? (Number(dustBlocks[dustBlocks.length - 1].style.top.slice(0, -2)) + 20 + "px") : dustBlocks[ft.to].style.top,
                    depth: ft.depth
                }))
        )
    };

    return (
        div(containerAttr)(Repeat(ContentDivisionLine, getTransforms))
    )
}
function ContentDivisionLine(info:{from:string, to:string, depth:number}){
    return div({
        class: "content-division-line",
        inlineStyle: U(() => ({
            top: info.from,
            height: `calc(${info.to} - ${info.from} - 1em)`,
            left: `${2 * info.depth}em`
        }))
    })()
}