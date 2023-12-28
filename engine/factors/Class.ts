import { HTMLObject } from "@/objects";

export class Class<T extends HTMLObject> {
    private class:DOMTokenList;
    private obj:T;
    public static new<T extends HTMLObject>(obj:T, element:HTMLElement){
        return new Class(obj, element)
    }
    private constructor(obj:T, element:HTMLElement){
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