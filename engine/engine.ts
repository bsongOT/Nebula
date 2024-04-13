import { Tree } from "./data-structure/tree"

class Analyzer {

}

class Updater {
    private list:(()=>void)[] = []
    private loop: NodeJS.Timeout | undefined;
    register(func:()=>void){
        this.list.push(func)
        if (this.loop) clearInterval(this.loop)
        this.loop = setInterval(
            () => {
                this.list.forEach(l => l())
            }
        , 100)
    }
}

export const engine = {
    analyzer: new Analyzer(),
    updater: new Updater(),/*
    debugTool: () => {
        return new WCanvasContainer()
    }*/
}