import { U } from "@/engine";
import { Attribute, div } from "@/funcObject";
import context from "../../context";
import { NestingList } from "./NestingList";
import { UniverseSelector } from "./UniverseSelector";
import { NebulaSelector } from "./NebulaSelector";

export function Carousel() {
    const attr:Attribute<"div"> = {
        class: "row",
        inlineStyle: U(() => ({
            left: context.selection.universe ? context.selection.nebula ? "-200%" : "-100%" : "0"
        }))
    }

    return (
        div({ class: "carousel" })(
            div(attr)(
                UniverseSelector(),
                NebulaSelector(),
                NestingList()
            )
        )
    )
}