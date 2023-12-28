export class EventQueue<T extends (...args:any[])=>void> {
    private readonly delegate:T[]
    private readonly emptyFunc:T;
    constructor(){
        this.emptyFunc = new Function() as T
        this.delegate = [this.emptyFunc];
    }
    public register(func:T){
        const d = this.delegate;
        const puttable = d.at(-1) === this.emptyFunc;

        if (puttable) d[d.length - 1] = func;
        else this.delegate.push(func)
        
        this.delegate.push(this.emptyFunc)
    }
    public invoke(...args:Parameters<T>){
        for (let c of this.delegate) c(...args)
    }
    public modify(func:T){
        this.delegate[this.delegate.length - 1] = func;
    }
    public isEmpty(){
        return this.delegate[0] === this.emptyFunc;
    }
}