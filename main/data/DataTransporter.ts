import { Content } from "./Data";

type CollectionLoadKey = "all-dusts" | "all-contents" | "all-nebulas" | "all-universes" | "all-relations"
type SystemNebulasLoadKey = "all-day-nebulas" | "all-lifetime-nebulas"
type DataLoadKey = CollectionLoadKey | SystemNebulasLoadKey;

export const $ = (name:DataLoadKey) => localStorage.getItem(name)
export const $$ = (name:DataLoadKey, value:string) => localStorage.setItem(name, value)

function defaultSystemNebula(keyword:SystemNebulasLoadKey){
    switch(keyword){
        case "all-day-nebulas": return {
            add: new Array<{content: Content, day:Date}>(),
            modify: new Array<{content: Content, day:Date}>(),
            remove: new Array<{content: Content, day:Date}>()
        }
        case "all-lifetime-nebulas": return {
            deads: new Array<string>(),
            modifieds: new Array<Content>(),
            livings: new Array<Content>(),
            news: new Array<Content>()
        }
    }
}

export class DataTransporter {
    public static loadWildDataCollection(keyword:CollectionLoadKey){
        const str = $(keyword);
        const json = str === null || str.trim() === "" ? "[]" : JSON.parse(str);
        const boxes = Array.from(json) as any[];
    
        return boxes
    }
    public static loadSystemNebulas(keyword:SystemNebulasLoadKey){
        const str = $(keyword);
        const json = str === null || str.trim() === "" ? defaultSystemNebula(keyword) : JSON.parse(str);
        
        if (keyword === "all-day-nebulas") return json as {
            add: {content:Content, day:Date}[],
            modify: {content:Content, day:Date}[],
            remove: {content:Content, day:Date}[]
        }
        if (keyword === "all-lifetime-nebulas") return json as {
            deads: string[],
            modifieds: Content[],
            livings: Content[],
            news: Content[]
        }
    }
}