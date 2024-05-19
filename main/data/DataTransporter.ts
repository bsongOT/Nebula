import { Content, Data } from "./Data";
import { Packer } from "./DataParser";

type CollectionLoadKey = "all-dusts" | "all-contents" | "all-nebulas" | "all-universes" | "all-relations"
type SystemNebulasLoadKey = "all-day-nebulas" | "all-lifetime-nebulas"
type DataLoadKey = CollectionLoadKey | SystemNebulasLoadKey;

export const $ = (name:DataLoadKey) => localStorage.getItem(name)
export const $$ = (name:DataLoadKey, value:string) => localStorage.setItem(name, value)

function defaultDayNebula(){
    return {
        add: new Array<{content: Content, day:Date}>(),
        modify: new Array<{content: Content, day:Date}>(),
        remove: new Array<{content: Content, day:Date}>()
    }
}
function defaultLifetimeNebula(){
    return {
        deads: new Array<string>(),
        modifieds: new Array<Content>(),
        livings: new Array<Content>(),
        news: new Array<Content>()
    }
}

export class DataTransporter {
    public static loadWildDataCollection(keyword:CollectionLoadKey){
        const str = $(keyword);
        const json = str === null || str.trim() === "" ? [] : JSON.parse(str);
    
        return Array.from(json) as any[]
    }
    public static loadWildDayNebula(){
        const str = $("all-day-nebulas");
        const json = str === null || str.trim() === "" ? defaultDayNebula() : JSON.parse(str);
        
        return json;
    }
    public static loadWildLifetimeNebula(){
        const str = $("all-lifetime-nebulas");
        const json = str === null || str.trim() === "" ? defaultLifetimeNebula() : JSON.parse(str);
        
        return json;
    }
    public static save(data:Data){
        const dusts = data.dusts.map(d => Packer.dust(d));
        const contents = data.contents.map(c => Packer.content(c));
        const nebulas = data.nebulas.map(n => Packer.nebula(n));
        const universes = data.universes.map(u => Packer.universe(u));
        const relations = data.relations.map(r => Packer.relation(r));

        $$("all-dusts", JSON.stringify(dusts))
        $$("all-contents", JSON.stringify(contents))
        $$("all-nebulas", JSON.stringify(nebulas))
        $$("all-universes", JSON.stringify(universes))
        $$("all-relations", JSON.stringify(relations))
    }
}