import { HTMLObject } from "@/objects";

export class Classifier<T extends HTMLObject> {
    private class:DOMTokenList;
    private obj:T;
    constructor(obj:T, element:HTMLElement){
        this.class = element.classList;
        this.obj = obj;
    }
    public add(...tokens:string[]){
        this.class.add(...tokens)
        return this.obj;
    }
    public remove(...tokens:string[]){
        this.class.remove(...tokens)
        return this.obj;
    }
    public toggle(token:string){
        this.class.toggle(token)
        return this.obj;
    }
    public contains(token:string){
        return this.class.contains(token)
    }
}