export class Updated<E extends HTMLElement, T> {
    constructor(public attr:((element:E)=>T)){}
}
export function U<E extends HTMLElement, T>(attr:((element:E) => T)){
    return new Updated(attr)
}
export function Repeat<I extends {}>(component:(info:I) => HTMLElement, dataProvider:() => I[]){
    const arr = new Array<any>();
    const infos = new Array<I>();

    engine.updater.register(() => {
        const datas = dataProvider() 
        const diff = Math.abs(arr.length - datas.length);

        if (arr.length > datas.length){
            infos.splice(datas.length, diff);
            arr.splice(datas.length, diff);
        }
        else if (arr.length < datas.length){
            for (let i = arr.length; i < datas.length; i++) {
                infos.push(datas[i]);
                arr.push(component(infos[i]))
            }
        }
        for (let i = 0; i < infos.length; i++){
            Object.assign(infos[i], datas[i])
        }
    })

    return arr;
}
export function either(cases:{if: () => any, then: HTMLElement}[]){
    const arr = new Array<HTMLElement>();

    engine.updater.register(() => {
        arr.splice(0, arr.length);
        arr.push(...cases.filter(c => c.if()).map(c => c.then))
    })

    return arr;
}
export function one(cases:{if: () => any, then: HTMLElement}[]){
    const arr = new Array<HTMLElement>();

    engine.updater.register(() => {
        arr.splice(0, arr.length);
        const elt = cases.find(c => c.if())?.then;
        if (elt) arr.push(elt)
    })

    return arr;
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