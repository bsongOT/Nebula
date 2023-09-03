import {WoOption} from "../engine/types"
import {Content} from "./data/Data"
import {Filter, Search, SortTool} from "./custom-object/ContentsContainer/"

export type ContentsListOption = WoOption & {
    contents:Content[],
    filter?:Filter,
    search?:Search,
    sort?:SortTool
}
export type AddButtonOption = WoOption & {
    onadded?:Function
}