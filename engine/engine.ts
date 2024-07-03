export class Updated<E extends HTMLElement, T> {
    constructor(public attr:((element:E)=>T)){}
}
export function U<E extends HTMLElement, T>(attr:((element:E) => T)){
    return new Updated(attr)
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
    updater: new Updater(),
}