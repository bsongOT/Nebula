export class EventQueue<T extends (...args:any[])=>void> {
    private readonly delegate:T[]
    private callback:T|undefined;
    constructor(){
        this.delegate = [];
    }
    public register(func:T){
        this.delegate.push(func)
    }
    public invoke(...args:Parameters<T>){
        for (let c of this.delegate) c(...args)
        this.callback?.(...args)
    }
    public setListener(func:T){
        this.callback = func;
    }
}