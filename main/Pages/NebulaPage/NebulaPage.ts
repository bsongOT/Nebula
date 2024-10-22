import { Content, Nebula } from "../../data/Data";
import { TreeNode } from "@/data-structure/tree";
import context from "../../context";
import "./NebulaPage.css"
import { engine } from "@/engine";
import { toPaths } from "@/data-structure/utils";
import { Coord, H, HexCoord, P } from "@/utils/math/coord-system";
import { HexGrid } from "@/data-structure/hexgrid";

export type CommonNebulaEditorInfo = {
    selectedNode?:TreeNode<Content>
}

export const svgNS = "http://www.w3.org/2000/svg";

class ContentPoint {
    constructor(
        public position:Coord,
        public side:number,
        public node:TreeNode<Content>,
        public textDisplay: "normal" | "lean" | "none"
    ){}
    private getColor(){
        if (context.drageeStar === this.node) return "green";
        if (context.selection.content === this.node.data) return "red";
        if (context.scrollVisibleContentNodes.has(this.node)) return "black";
        return "#bbb";
    }
    public render(ctx:CanvasRenderingContext2D, mouseX:number, mouseY:number){
        ctx.beginPath();
        ctx.save();
        const {x, y} = this.position;
        if ((mouseX - x) ** 2 + (mouseY - y) ** 2 <= 64 ||
            context.waitingContents.includes(this.node)){
            ctx.fillStyle = "skyblue";
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath()
        }
        ctx.fillStyle = this.getColor();

        const textSize = ctx.measureText(this.node.data.title);
        const textHeight = textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent;
        ctx.font = `${Math.max(this.side, 10)}px arial`
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "black";
        if (this.textDisplay !== "none") {
            ctx.translate(x, y);
            if (this.textDisplay === "lean") ctx.rotate(Math.PI / 3);
            ctx.translate(-x, -y);
            ctx.fillText(this.node.data.title, x + 5, y + textHeight / 2);
            if (this.textDisplay === "lean") ctx.rotate(-Math.PI / 3);
        }
        ctx.closePath()
        ctx.restore()
    }
    public onclick(mouseX:number, mouseY:number){
        const {x, y} = this.position;
        if ((mouseX - x) ** 2 + (mouseY - y) ** 2 >= 64) return;
        if (context.waitingContents.includes(this.node)) {
            context.waitingContents = context.waitingContents.filter(wc => wc !== this.node);
        }
        else{
            context.waitingContents.push(this.node)
        }
    }
    public onmousedown(mouseX:number, mouseY:number){
        const {x, y} = this.position;
        if ((mouseX - x) ** 2 + (mouseY - y) ** 2 >= 64) return;
        context.drageeStar = this.node;
        context.dragStartY = mouseY;
        context.dragProgress = Math.max(Math.min((mouseY - context.dragStartY) / (this.side * 1.732), 1), -1)
    }
    public onmousemove(mouseX:number, mouseY:number){
        if (!context.drageeStar) return;
        if (this.node !== context.drageeStar) return;
        context.dragProgress = Math.max(Math.min((mouseY - context.dragStartY) / (this.side * 1.732), 1), -1)
    }
}

export function NebulaModel(){
    const cv = document.createElement("canvas");
    const ctx = cv.getContext("2d")!;
    const boardSize = 15;

    cv.style.width = "100%";
    cv.style.height = "100%";
    engine.updater.register(update)

    let mouseX = 0;
    let mouseY = 0;
    let stars = new Array<ContentPoint>();

    document.onmousemove = e => {
        const r =  cv.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
        for (const star of stars) star.onmousemove(mouseX, mouseY);
    }

    cv.onclick = () => {
        for (const star of stars) star.onclick(mouseX, mouseY);
    }

    cv.onmousedown = () => {
        for (const star of stars) star.onmousedown(mouseX, mouseY);
    }

    document.addEventListener("mouseup", () => {
        if (!context.drageeStar) return;
        if (!context.selection.nebula) return;

        const nebs = context.data.nebulas.filter(n => n.tree.nodes.some(cn => cn.data === context.drageeStar!.data))
        if (context.dragProgress > 0.8) {
            const neb = nebs[nebs.indexOf(context.selection.nebula) + 1];
            if (!neb) return;
            context.selection.universe = context.data.universes.find(
                u => u.nebulaLocations.find(nl => nl.nebula === neb) !== undefined
            ) ?? context.data.independentUniverse
            context.selection.nebula = neb;
        }
        else if (context.dragProgress < -0.8){
            const neb = nebs[nebs.indexOf(context.selection.nebula) - 1];
            if (!neb) return;
            context.selection.universe = context.data.universes.find(
                u => u.nebulaLocations.find(nl => nl.nebula === neb) !== undefined
            ) ?? context.data.independentUniverse
            context.selection.nebula = neb;
        }
        
        context.drageeStar = undefined;
        context.dragProgress = 0;
    })

    function update(){
        if (!context.selection.nebula) return;
        cv.width = cv.scrollWidth;
        cv.height = cv.scrollHeight;
        const grid = new HexGrid(H(1,1,1).scale(boardSize))
        const paths = toPaths(context.selection.nebula.tree);
        const size = grid.size.x;
        const pivot = H(1, 0, 1).scale(size - 1);
        const canvasCenter = P(cv.width / 2, cv.height / 2);
        const side = 0.9 * Math.min(cv.width / (1.732 * (2 * size - 1)), cv.height / (3 * size - 1));

        ctx.clearRect(0, 0, cv.width, cv.height);
        const points = [
            [0, -side], [0.866 * side, -side / 2], [0.866 * side, side / 2],
            [0, side],  [-0.866 * side, side / 2], [-0.866 * side, -side / 2],
        ].map(p => [Math.round(p[0]), Math.round(p[1])]);

        ctx.strokeStyle = "#ccc";
        ctx.fillStyle = "#f0f0f0";
        for (const pos of grid.range) {
            const coord = pos.sub(pivot).toCoord(side).add(canvasCenter);
            const ps = points.map(p => P(p[0] + coord.x, p[1] + coord.y))

            ctx.beginPath();
            ctx.moveTo(ps[0].x, ps[0].y)
            ctx.lineTo(ps[1].x, ps[1].y)
            ctx.lineTo(ps[2].x, ps[2].y)
            ctx.lineTo(ps[3].x, ps[3].y)
            ctx.lineTo(ps[4].x, ps[4].y)
            ctx.lineTo(ps[5].x, ps[5].y)
            ctx.closePath()
            ctx.stroke()
            ctx.fill();
        }
        
        if (paths.length === 0) return;
        stars = new Array<ContentPoint>();
        const start = H(boardSize - 1, 0, 0);
        let depth = 0;
        for (const path of paths){
            ctx.strokeStyle = "#aaa";
            ctx.beginPath();
            for (let i = 0; i < path.length; i++){
                const pointInfo = path[i];
                const hpos = pointInfo.pos.add(start).add(H(-1, 0, 1).scale(depth));
                const pos = hpos.sub(pivot).toCoord(side).add(canvasCenter).add(P(0, context.dragProgress * side * 3));
                
                if (pointInfo.node === context.drageeStar) pos.y -= context.dragProgress * side * 3
                if (i === 0) ctx.moveTo(pos.x, pos.y);
                else ctx.lineTo(pos.x, pos.y);

                const textDisplay = (() => {
                    if (!path[i + 1]) return "lean";
                    if (!path[i + 1].pos.sub(path[i].pos).eq(H(0, 0, 1))) return "lean";
                    for (let j = 1; j < 9; j++){
                        if (!path[i + j]) break;
                        const diff = path[i + j].pos.sub(path[i].pos);
                        if (diff.x !== diff.z) continue;
                        if (diff.x + 2 * diff.y + diff.z > 7) continue;
                        return "none"
                    }
                    return "normal"
                })

                stars.push(
                    new ContentPoint(
                        pos,
                        side,
                        pointInfo.node,
                        textDisplay()
                    )
                )
            }
            ctx.stroke();
            depth += Math.ceil((Math.max(...path.map(i => i.pos.z - i.pos.x)) + 1) / 2) + 1;
        }

        if (context.waitingContents.length > 0){
            const first = stars.find(s => s.node === context.waitingContents[0])?.position;
            if (!first) return;
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(first.x, first.y);
            for (const node of context.waitingContents){
                const star = stars.find(s => s.node === node);
                if (!star) break;
                ctx.lineTo(star.position.x, star.position.y)
            }
            ctx.stroke()
            ctx.lineWidth = 1;
        }

        for (const star of stars){
            star.render(ctx, mouseX, mouseY);
        }

        if (!context.drageeStar) return;

        const nebs = context.data.nebulas.filter(neb => neb.tree.nodes.some(tn => tn.data === context.drageeStar!.data));
        const currentIndex = nebs.indexOf(context.selection.nebula);
        const scrolledStar = stars.find(s => s.node === context.drageeStar);
        const scrolledStarHexPos = paths.flat().find(i => i.node === context.drageeStar)?.pos;

        if (currentIndex === -1) return;
        if (!scrolledStar) return;
        if (!scrolledStarHexPos) return;

        const toWorldPos = (hexPos:HexCoord)=>{
            const hpos = hexPos.add(start);
            const pos = hpos.sub(pivot).toCoord(side).add(canvasCenter);
            return pos.add(P(0, context.dragProgress * side * 3));
        }

        for (let i = 0; i < nebs.length; i++){
            if (i === currentIndex) continue;
            const otherPath = toPaths(nebs[i].tree).flat();
            const matchedStarIndex = otherPath.findIndex(p => p.node.data === context.drageeStar!.data);
            const matchedStar  = otherPath[matchedStarIndex];
            if (!otherPath) continue;
            if (otherPath.length <= 0) continue;
            if (matchedStarIndex === -1) continue;

            const adjuster = H(1, 0, -1).scale(i - currentIndex).add(matchedStar.pos).sub(scrolledStarHexPos);

            ctx.beginPath();
            const first = toWorldPos(otherPath[0].pos.add(adjuster));
            ctx.moveTo(first.x, first.y);
            for (const dot of otherPath){
                const worldPos = toWorldPos(dot.pos.add(adjuster))
                ctx.lineTo(worldPos.x, worldPos.y)
            }
            ctx.stroke()
            ctx.fillStyle = "black";
            for (const dot of otherPath){
                const worldPos = toWorldPos(dot.pos.add(adjuster))
                if (dot === matchedStar) continue;
                ctx.beginPath();
                ctx.moveTo(worldPos.x + 4, worldPos.y);
                ctx.arc(worldPos.x, worldPos.y, 4, 0, 2 * Math.PI)
                ctx.stroke();
                ctx.fill();
                ctx.fillText(dot.node.data.title, worldPos.x - ctx.measureText(dot.node.data.title).width / 2, worldPos.y - 10);
            }
        }
    }

    return cv;
}