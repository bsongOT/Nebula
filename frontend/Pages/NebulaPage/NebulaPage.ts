import { Content, Nebula } from "../../../backend/data/Data";
import { Tree, TreeNode } from "@/data-structure/tree";
import context from "../../context";
import { engine, one, Repeat, U } from "@/engine";
import { toPaths } from "@/data-structure/utils";
import { Coord, H, HexCoord, P } from "@/utils/math/coord-system";
import { HexGrid } from "@/data-structure/hexgrid";
import { div, inputText, btn, Attribute, ul, li } from "@/funcObject";
import { Title } from "../../Components/Title";
import { r3 } from "@/utils/math/consts";

export function NebulaPage(info:{nebula?:Nebula, pageAddition?: number}){
    const attr:Attribute<"div"> = {
        className: "page",
    }
    const nebulaTitle = Title({
        get string(){
            return info.nebula?.name ?? ""
        },
        set string(v:string){
            if (!info.nebula) return;
            info.nebula.name = v;
        }
    })
    const mainPageAttr:Attribute<"div"> = {
        inlineStyle: U(() => ({
            display: pageNum() <= 0 ? 'flex' : "none",
            flexDirection: 'column',
            height: "100%"
        }))
    }
    const notePageAttr:Attribute<"ul"> = {
        inlineStyle: U(() => ({
            display: pageNum() > 0 ? 'flex' : "none",
            flexDirection: 'column',
            height: "100%",
            margin: "0"
        }))
    }

    function pageNum(){
        return context.currentNebulaPageNumber + (info.pageAddition ?? 0);
    }

    return (
        div(attr)(
            div(mainPageAttr)(
                nebulaTitle,
                div({
                    inlineStyle: U(() => ({
                        position: "absolute",
                        left: "50%",
                        translate: "-50%",
                        display: context.waitingContents.length > 0 ? "" : "none"
                    }))
                })([
                    div()(() => `새 네뷸라 구성 중 (${context.waitingContents.length})`),
                    btn({ onclick: () => context.waitingContents = [] })("취소"),
                    btn({
                        onclick: () => {
                            const name = prompt("네뷸라 이름을 입력하십시오.") ?? undefined;
                            const tree = new Tree<Content>()
                            for (const contentNode of context.waitingContents)
                                tree.insert(new TreeNode(contentNode.data));
                            context.data.addNebula(new Nebula({ name, tree }))
                            context.waitingContents = [];
                        }
                    })("완료")
                ]),
                div({
                    inlineStyle: {
                        flexGrow: "1",
                        overflow: "hidden",
                    }
                })(NebulaModel(info))
            ),
            ul(notePageAttr)(
                Repeat(
                    i => {

                        return (
                            li({inlineStyle: U(() => ({
                                fontSize: i.depth < 0 ? "x-large" : "",
                                listStyle: i.depth < 0 ? "none" : "",
                                marginLeft: `${i.depth >= 0 ? i.depth * 20 : -25}px`
                            }))})(() => i.text)
                        )
                    },
                    () => {
                        const nebula = info.nebula;
                        if (!nebula) return []
                        const pageNumber = pageNum();
                        return (
                            nebula.tree.traverse()
                                .map(i => [
                                    {
                                        text: i.node.data.title,
                                        depth: -1 // 컨텐츠임을 의미
                                    },
                                    ...i.node.data.dusts.traverse().map(i => ({
                                        text: i.node.data.claim,
                                        depth: i.depth
                                    }))
                                ])
                                .flat()
                                .slice(30 * (pageNumber - 1), 30 * pageNumber)
                        )
                    }
                )
            )
        )
    )
}

class ContentPoint {
    constructor(
        public position:Coord,
        public side:number,
        public node:TreeNode<Content>,
        public textDisplay: "normal" | "lean" | "none"
    ){}
    private getColor(){
        if (this.node.data.id < 0) return "white"
        if (context.drageeStar === this.node) return "green";
        if (context.selection.content === this.node.data) return "red";
        if (context.scrollVisibleContentNodes.has(this.node)) return "black";
        return "#bbb";
    }
    private hoverWorks(mouseX:number, mouseY:number){
        const {x, y} = this.position;
        if (this.node.data.id < 0) return false;
        if ((mouseX - x) ** 2 + (mouseY - y) ** 2 <= 64) return true;
        if (context.waitingContents.includes(this.node)) return true;
        return false;
    }
    public render(ctx:CanvasRenderingContext2D, mouseX:number, mouseY:number){
        ctx.beginPath();
        ctx.save();
        const {x, y} = this.position;
        if (this.hoverWorks(mouseX, mouseY)){
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
        if (this.node.data.id < 0) ctx.stroke();
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
        if (this.node.data.id < 0) return;
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
        if (this.node.data.id < 0) return;
        context.drageeStar = this.node;
        context.dragStartY = mouseY;
        context.dragProgress = Math.max(Math.min((mouseY - context.dragStartY) / (this.side * 1.732), 1), -1)
    }
    public onmousemove(mouseX:number, mouseY:number){
        if (this.node.data.id < 0) return;
        if (!context.drageeStar) return;
        if (this.node !== context.drageeStar) return;
        context.dragProgress = Math.max(Math.min((mouseY - context.dragStartY) / (this.side * 1.732), 1), -1)
    }
}

export class NebulaPath {
    public stars:ContentPoint[];
    public path;

    constructor(path:{pos:HexCoord, node:TreeNode<Content>}[]){
        this.stars = [];
        this.path = path;
    }
    public render(ctx:CanvasRenderingContext2D, position:Coord, side:number){
        ctx.strokeStyle = "#aaa";
        ctx.beginPath();
        const path = this.path;
        if (!path) return;
        for (let i = 0; i < this.path.length; i++){
            const pos = path[i].pos.toCoord(side).add(position);
            
            if (path[i].node === context.drageeStar) pos.y -= context.dragProgress * side * 3
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);

            const textDisplay = () => {
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
            }

            this.stars.push(new ContentPoint(pos, side, path[i].node, textDisplay()))
        }
        ctx.stroke();
    }
}

export function NebulaModel(info:{nebula?:Nebula}){
    const cv = document.createElement("canvas");
    const ctx = cv.getContext("2d")!;
    const boardSize = 30;

    cv.style.width = "100%";
    cv.style.height = "100%";
    engine.updater.register(update)

    let mouseX = 0;
    let mouseY = 0;
    let stars = new Array<ContentPoint>();
    
    cv.onclick = () => {
        for (const star of stars) star.onclick(mouseX, mouseY);
    }
    cv.onmousedown = () => {
        for (const star of stars) star.onmousedown(mouseX, mouseY);
    }    
    document.addEventListener("mousemove", e => {
        const r =  cv.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
        for (const star of stars) star.onmousemove(mouseX, mouseY);
    })
    document.addEventListener("mouseup", () => {
        if (!context.drageeStar) return;
        if (!info.nebula) return;

        const nebs = context.data.nebulas.filter(n => n.tree.nodes.some(cn => cn.data === context.drageeStar!.data))
        if (context.dragProgress > 0.8) {
            const neb = nebs[nebs.indexOf(info.nebula) + 1];
            if (!neb) return;
            context.selection.universe = context.data.universes.find(
                u => u.nebulaLocations.find(nl => nl.nebula === neb) !== undefined
            )
            info.nebula = neb;
        }
        else if (context.dragProgress < -0.8){
            const neb = nebs[nebs.indexOf(info.nebula) - 1];
            if (!neb) return;
            context.selection.universe = context.data.universes.find(
                u => u.nebulaLocations.find(nl => nl.nebula === neb) !== undefined
            )
            info.nebula = neb;
        }
        
        context.drageeStar = undefined;
        context.dragProgress = 0;
    })

    function update(){
        if (!info.nebula) return;
        cv.width = cv.scrollWidth;
        cv.height = cv.scrollHeight;

        const grid = new HexGrid(H(1,1,1).scale(boardSize))
        const paths = toPaths(info.nebula.tree);
        const size = grid.size.x;
        const pivot = H(1, 0, 1).scale(size - 1);
        const canvasCenter = P(cv.width / 2, cv.height / 2);
        const side = Math.min((cv.width - 10) / (r3 * (size + 1)), (cv.height - 10) / 42);

        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.strokeStyle = "#ccc";
        ctx.fillStyle = "#f0f0f0";
        
        if (paths.length === 0) return;
        stars = new Array<ContentPoint>();
        let totalHeight = 0;
        let scrollInside = false;
        for (const path of paths){
            if (!scrollInside && path.every(i => !context.scrollVisibleContentNodes.has(i.node))) continue;
            scrollInside = true;

            const pathObj = new NebulaPath(path)
            pathObj.render(ctx, P(side, side).add(P(0, totalHeight)).add(P(0, context.dragProgress * side * 3)), side)
            stars.push(...pathObj.stars)
            totalHeight += Math.max(...path.map(i => i.pos.toCoord(side).y)) + 6 * side
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
        const currentIndex = nebs.indexOf(info.nebula);
        const scrolledStar = stars.find(s => s.node === context.drageeStar);
        const scrolledStarHexPos = paths.flat().find(i => i.node === context.drageeStar)?.pos;

        if (currentIndex === -1) return;
        if (!scrolledStar) return;
        if (!scrolledStarHexPos) return;

        const toWorldPos = (hexPos:HexCoord)=>{
            const pos = hexPos.sub(pivot).toCoord(side).add(canvasCenter);
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