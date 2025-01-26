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
    nebulaLocations:{
        nebula: number,
        start: {
            x: number,
            y: number,
            z: number
        }
    }[],
    relations:number[]
}
export class DataSaver {
    public static save(data:Data){
        this.saveDusts(data.dusts);
        this.saveContents(data.contents);
        this.saveNebulas(data.nebulas);
        this.saveRelations(data.relations);
        this.saveUniverses(data.universes);
    }
    private static saveDusts(dusts:DataCollection<Dust>){
        const electron = window.electron;
        const array:PackedDust[] = dusts.map(d => ({
            id: d.id,
            claim: d.claim
        }))
        electron.write("./nebula/dusts.json", JSON.stringify(array, null, 1));
    }
    private static saveContents(contents:DataCollection<Content>){
        const electron = window.electron;
        const array:PackedContent[] = contents.map(c => ({
            id: c.id,
            title: c.title,
            dusts: c.dusts.map(d => d.id).arrayize()
        }))
        electron.write("./nebula/contents.json", JSON.stringify(array, null, 1));
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
    private static saveRelations(relations:DataCollection<Relation>){
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
        electron.write("./nebula/relations.json", JSON.stringify(array, null, 1))
    }
    private static saveUniverses(universes:DataCollection<Universe>){
        const electron = window.electron;
        const array:PackedUniverse[] = universes.map(u => ({
            id: u.id,
            name: u.name,
            nebulaLocations: u.nebulaLocations.map(nl =>({
                nebula: nl.nebula.id,
                start: nl.start
            })),
            relations: u.relations.map(r => r.id)
        }))
    }
}
export class DataLoader {
    public static async load(){
        const dusts = await this.loadDusts();
        const contents = await this.loadContents();
        const nebulas = await this.loadNebulas();
        const relations = await this.loadRelations();
        const universes = await this.loadUniverses();
        
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
            universe.nebulaLocations = universe.nebulaLocations.map(nl => ({
                nebula: nebulas.get(nl.nebula.id) ?? nl.nebula,
                start: nl.start
            }))
            universe.relations = universe.relations.map(r => relations.get(r.id) ?? r)
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
            nebulaLocations: u.nebulaLocations.map(nl => ({
                nebula: new Nebula({id: nl.nebula}),
                start: H(nl.start.x, nl.start.y, nl.start.z)
            })),
            relations: u.relations.map(r => new Relation({id: r, mainTree: new Nebula(), secondTree: new Nebula()}))
        } satisfies Universe)))
    }
}