import { btn, div, li } from "@/funcObject"
import { Nebula } from "../data/Data";
import { engine } from "@/engine";

export const NebulaWindow = (info:{shownNebula:Nebula}) => {
    const importerItems = new Array<HTMLLIElement>()

    engine.updater.register(() => {
        importerItems.splice(0, importerItems.length);
        importerItems.push(...info.shownNebula.importers.map(i => li()([
            btn()(i.name),
            btn({class: "importer-arrow"})("")
        ])));
    })

    return div()([
        div()([
            div({class: "nebula-importer-list"})(importerItems),
            btn({class: "nebula-palette-opener"})("Palette"),
            btn({class: "importer-arrow"})(""),
            btn({class: "nebula-destination"}, {innerText: () => info.shownNebula.name})("")
        ])
    ])
}
export const NebulaView = (info:{openedNebulas:Nebula[], shownNebula:Nebula}) => {
    const openedTabs = new Array<HTMLDivElement>();

    engine.updater.register(()=>{
        openedTabs.splice(0, openedTabs.length)
        openedTabs.push(...info.openedNebulas.map(n => div()([
            div()(n.name),
            btn({class: "close-button"})("X")
        ])))
    })

    return div()([
        div({class: "current-opened-tabs"})(openedTabs),
        NebulaWindow(info)
    ])
}