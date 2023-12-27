import { Tree } from "./data-structure/tree"
import { WebObject } from "./objects"
import { CanvasContainer } from "./objects/CanvasObject"

export const engine = {
    hierarchy: new Tree<WebObject>(),
    debugTool: () => {
        return new CanvasContainer([
            
        ])
    }
}