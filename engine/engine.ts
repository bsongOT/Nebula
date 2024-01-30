import { Tree } from "./data-structure/tree"
import { WebObject } from "./objects/WebObject"
import { WCanvasContainer } from "./objects/CanvasObject"

export const engine = {
    hierarchy: new Tree<WebObject>(),/*
    debugTool: () => {
        return new WCanvasContainer()
    }*/
}