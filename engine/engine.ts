export class Updated<E extends HTMLElement, T> {
    constructor(public attr:((element:E)=>T)){}
}
export function U<E extends HTMLElement, T>(attr:((element:E) => T)){
    return new Updated(attr)
}
export class Repeated<C extends (info:any) => HTMLElement, T> {
    public infos:Parameters<C>[0][] = []
    constructor(
        public component:C,
        public datas:T[] | (() => T[]),
        public toInfo:(data:T) => Parameters<C>[0]
    ){}
}
export function Repeat<C extends (info:any) => HTMLElement, T>(component:C, datas:T[] | (() => T[]), toInfo:(data:T) => Parameters<C>[0]){
    return new Repeated(component, datas, toInfo)
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