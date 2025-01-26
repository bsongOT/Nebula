import { canvas, div } from "@/funcObject";
import { Title } from "../Components/Title";
import context from "../context";
import { Nebula } from "../../backend/data/Data";
import { engine, Repeat } from "@/engine";
import { NebulaPath } from "./NebulaPage/NebulaPage";
import { toPaths } from "@/data-structure/utils";
import { P } from "@/utils/math/coord-system";

export function UniversePage(){
    return (
        div({ className: "page" })(
            Title({
                get string(){
                    return context.selection.universe?.name ?? ""
                },
                set string(v:string){
                    if (!context.selection.universe) return;
                    context.selection.universe.name = v;
                }
            }),
            div()(Repeat(NebulaPreviewer, () => context.selection.universe?.nebulaLocations ?? []))
        )
    )
}
function NebulaPreviewer(info:{nebula:Nebula}){
    const cv = document.createElement("canvas");
    const ctx = cv.getContext("2d")!;
    const attr = {
        inlineStyle: {
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '2px 2px 4px #aaa',
            marginBottom: '10px'
        }
    }

    engine.updater.register(() => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.strokeStyle = "#ccc";
        ctx.fillStyle = "#f0f0f0";

        new NebulaPath(toPaths(info.nebula.tree)[0]).render(ctx, P(10, 10), 20);
    })

    return (
        div(attr)(
            div()(() => info.nebula.name),
            cv        
        )
    )
}