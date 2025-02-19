import { Tree } from "@/data-structure/tree";
import { Dust } from "./components/Dust";
import { Content, Data, Nebula } from "./Data";
import { DataCollection } from "./DataCollection";
import { Relation } from "./components/Relation";
import { Universe } from "./components/Universe";
import { H } from "@/utils/math/coord-system";
import { ElectronAPI } from "../electron/preload";

declare global {
    interface Window {
        electron: ElectronAPI
    }
}
type PackedDust = {
    id:number,
    claim:string
}
type PackedContent = {
    id:number, 
    title:string, 
    dusts: { 
        parent:number, 
        data:number 
    }[]
}
type PackedNebula = {
    id:number, 
    name:string, 
    tree: { 
        parent:number, 
        data:number
    }[]
}
type PackedRelation = {
    id:number, 
    mainTree:number, 
    secondTree:number, 
    table:{
        main:number, 
        second:number, 
        state:number
    }[]
}
type PackedUniverse = {
    id:number, 
    name:string, 
    nebulas:number[],
    relations:number[]
}
type PackedDayNebula = {
    id:number,
    name:string,
    tree: {
        parent:number,
        data:number
    }[]
}
export class DataSaver {
    private constructor(){}
    public static async save(data:Data){
        await this.saveDusts(data.dusts);
        await this.saveContents(data.contents);
        await this.saveNebulas(data.nebulas);
        await this.saveRelations(data.relations);
        await this.saveUniverses(data.universes);
        await this.saveDayNebula(data.systemUniverse.dayNebula);
        await this.saveFileAliases(data.fileAliases);
    }
    public static async saveContentsExport(contents:DataCollection<Content>){
        const fileNames = await window.electron.getDirectory("./contents");
        const contentsArr = contents.all();

        if (fileNames === undefined) return;
        for (const fileName of fileNames.filter(fn => contentsArr.every(c => `${c.title}.md` !== fn))){
            window.electron.removeFile(`./contents/${fileName}`);
        }
        for (const content of contentsArr){
            window.electron.write(`./contents/${content.title}.md`, (
                content.dusts.traverse()
                    .map(d => "\t".repeat(d.depth) + "- " + d.node.data.claim)
                    .join("\n")
            ))
        }
    }
    public static async saveNebulasExport(nebulas:DataCollection<Nebula>){
        const fileNames = await window.electron.getDirectory("./nebulas");
        const nebulaArrs = nebulas.all();

        if (fileNames === undefined) return;
        for (const fileName of fileNames.filter(fn => nebulaArrs.every(n => `${n.name}.md` !== fn))){
            window.electron.removeFile(`./nebulas/${fileName}`);
        }
        for (const nebula of nebulaArrs){
            window.electron.write(`./nebulas/${nebula.name}.md`, (
                nebula.tree.traverse()
                    .map(i => "\t".repeat(i.depth) + "- [[" + i.node.data.title + "]]")
                    .join("\n")
            ))
        }
    }
    private static async saveDusts(dusts:DataCollection<Dust>){
        const electron = window.electron;
        const array:PackedDust[] = dusts.map(d => ({
            id: d.id,
            claim: d.claim
        }))
        await electron.write("./nebula/dusts.json", JSON.stringify(array, null, 1));
    }
    private static async saveContents(contents:DataCollection<Content>){
        const electron = window.electron;
        const array:PackedContent[] = contents.map(c => ({
            id: c.id,
            title: c.title,
            dusts: c.dusts.map(d => d.id).arrayize()
        }))
        await electron.write("./nebula/contents.json", JSON.stringify(array, null, 1));
    }
    private static async saveNebulas(nebulas:DataCollection<Nebula>){
        const electron = window.electron;
        const array:PackedNebula[] = nebulas.map(n => ({
            id: n.id,
            name: n.name,
            tree: n.tree.map(c => c.id).arrayize()
        }))
        await electron.write("./nebula/nebulas.json", JSON.stringify(array, null, 1));
    }
    private static async saveRelations(relations:DataCollection<Relation>){
        const electron = window.electron;
        const array:PackedRelation[] = relations.map(r => ({
            id: r.id,
            mainTree: r.mainTree.id,
            secondTree: r.secondTree.id,
            table: r.table.map(ci => ({
                main: ci.main.id,
                second: ci.second.id,
                state: ci.state?.id ?? -1
            }))
        }))
        await electron.write("./nebula/relations.json", JSON.stringify(array, null, 1))
    }
    private static async saveUniverses(universes:DataCollection<Universe>){
        const electron = window.electron;
        const array:PackedUniverse[] = universes.map(u => ({
            id: u.id,
            name: u.name,
            nebulas: u.nebulas.map(n => n.id),
            relations: u.relations.map(r => r.id)
        }))
        await electron.write("./nebula/universes.json", JSON.stringify(array, null, 1))
    }
    private static async saveDayNebula(dayNebula:Nebula){
        const electron = window.electron;
        const packedDayNebula:PackedDayNebula = {
            id: dayNebula.id,
            name: "일지",
            tree: dayNebula.tree.map(c => {
                if (c.id < 0) {
                    if (c.title === "추가") return -0.1;
                    else if (c.title === "수정") return -0.2;
                    else if (c.title.endsWith("년")) return -Number(c.title.slice(0, -1));
                    else if (c.title.endsWith("월")) return -Number(c.title.slice(0, -1));
                    else if (c.title.endsWith("일")) return -Number(c.title.slice(0, -1));
                    else return NaN;
                }
                else {
                    return c.id
                }
            }).arrayize()
        }
        await electron.write("./nebula/day-nebula.json", JSON.stringify(packedDayNebula, null, 1))
    }
    private static async saveFileAliases(fileAliases:Record<string, string>){
        await window.electron.write("./nebula/file-aliases.json", JSON.stringify(fileAliases, null, 1));
    }
}
export class DataLoader {
    private constructor(){}
    public static async load(){
        const dusts = await this.loadDusts();
        const contents = await this.loadContents();
        const nebulas = await this.loadNebulas();
        const relations = await this.loadRelations();
        const universes = await this.loadUniverses();
        const dayNebula = await this.loadDayNebula();
        const fileAliases = await this.loadFileAliases();
        
        for (const content of contents.all()){
            content.dusts = content.dusts.map(d => dusts.get(d.id) ?? d);
        }
        for (const nebula of nebulas.all()){
            nebula.tree = nebula.tree.map(c => contents.get(c.id) ?? c);
        }
        for (const relation of relations.all()){
            relation.mainTree = nebulas.get(relation.mainTree.id) ?? relation.mainTree;
            relation.secondTree = nebulas.get(relation.secondTree.id) ?? relation.secondTree;
            relation.table = relation.table.map(cell => ({
                main: contents.get(cell.main.id) ?? cell.main,
                second: contents.get(cell.second.id) ?? cell.second,
                state: cell.state === null ? cell.state : dusts.get(cell.state.id) ?? null
            }))
        }
        for (const universe of universes.all()){
            universe.nebulas = universe.nebulas.map(n => nebulas.get(n.id) ?? n);
            universe.relations = universe.relations.map(r => relations.get(r.id) ?? r)
        }
        dayNebula.tree = dayNebula.tree.map(c => c.id < 0 ? c : (contents.get(c.id) ?? c));
        for (const contentNodeInfo of dayNebula.tree.traverse()){
            const content = contentNodeInfo.node.data;
            const depth = contentNodeInfo.depth;
            if (content.id >= 0) continue;
            if (depth === 0) content.title += "년";
            else if (depth === 1) content.title += "월";
            else if (depth === 2) content.title += "일"
        }

        return {
            dusts,
            contents,
            nebulas,
            relations,
            universes,
            dayNebula,
            fileAliases
        }
    }
    private static async loadDusts(){
        const electron = window.electron;
        const text = await electron.read("./nebula/dusts.json");
        const json = JSON.parse(text === "" ? "[]" : text);
        const array = Array.from(json) as PackedDust[];

        return new DataCollection(array.map(dl => new Dust({
            id: dl.id,
            claim: dl.claim
        } satisfies Dust)))
    }
    private static async loadContents(){
        const electron = window.electron;
        const text = await electron.read("./nebula/contents.json");
        const json = JSON.parse(text === "" ? "[]" : text);
        const array = Array.from(json) as PackedContent[];

        return new DataCollection(array.map(cl => new Content({
            id: cl.id,
            title: cl.title,
            dusts: Tree.treeize(cl.dusts.map(d => ({
                parent: d.parent,
                data: new Dust({id: d.data})
            })))
        } satisfies Content)))
    }
    private static async loadNebulas(){
        const electron = window.electron;
        const text = await electron.read("./nebula/nebulas.json");
        const json = JSON.parse(text === "" ? "[]" : text);
        const array = Array.from(json) as PackedNebula[];

        return new DataCollection(array.map(nl => new Nebula({
            id: nl.id,
            name: nl.name,
            tree: Tree.treeize(nl.tree.map(c => ({
                parent: c.parent,
                data: new Content({id: c.data})
            })))
        } satisfies Nebula)))
    }
    private static async loadRelations(){
        const electron = window.electron;
        const text = await electron.read("./nebula/relations.json");
        const json = JSON.parse(text === "" ? "[]" : text);
        const array = Array.from(json) as PackedRelation[]

        return new DataCollection(array.map(rl => new Relation({
            id: rl.id,
            mainTree: new Nebula({id: rl.mainTree}),
            secondTree: new Nebula({id: rl.secondTree}),
            table: rl.table.map(c => ({
                main: new Content({id: c.main}),
                second: new Content({id: c.second}),
                state: c.state >= 0 ? new Dust({id: c.state}) : null
            }))
        } satisfies Relation)))
    }
    private static async loadUniverses(){
        const electron = window.electron;
        const text = await electron.read("./nebula/universes.json");
        const json = JSON.parse(text === "" ? "[]" : text);
        const array = Array.from(json) as PackedUniverse[];

        return new DataCollection(array.map(u => new Universe({
            id: u.id,
            name: u.name,
            nebulas: u.nebulas.map(n => new Nebula({id: n})),
            relations: u.relations.map(r => new Relation({id: r, mainTree: new Nebula(), secondTree: new Nebula()}))
        } satisfies Universe)))
    }
    private static async loadDayNebula(){
        const electron = window.electron;
        const text = await electron.read("./nebula/day-nebula.json");
        const json = JSON.parse(text === "" ? "{}" : text) as PackedDayNebula;

        return new Nebula({
            id: -1,
            name: "일지",
            tree: Tree.treeize(json?.tree ?? []).map(i => {
                if (i < 0){
                    if (i < -0.05 && i > -0.15) return new Content({title: "추가"});
                    if (i < -0.15 && i > -0.25) return new Content({title: "수정"});
                    return new Content({title: -i + "", id: i})
                }
                else {
                    return new Content({id: i})
                }
            })
        } satisfies Nebula)
    }
    private static async loadFileAliases(){
        const electron = window.electron;
        const text = await electron.read("./nebula/file-aliases.json");
        return JSON.parse(text === "" ? "{}" : text) as Record<string, string>;
    }
}