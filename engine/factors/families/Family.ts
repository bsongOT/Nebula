import { TreeNode } from "@/data-structure/tree";
import { engine } from "@/engine";
import { WebObject, DOMObject, WBody } from "@/objects";
import { EventQueue } from "../events/Event";

export type Event<T extends Record<string, (...args:any)=>void>> = {
    [key in keyof T]:EventQueue<T[key]>
}
export class Family<C extends WebObject, P extends WebObject, T extends WebObject>{
    private node:TreeNode<WebObject>

    public get me():T{ return <T>this.node.data!; }
    public get parent(){ return this.node.parent?.data as P|undefined; }
    public get children(){ return this.node.children.map(c => c.data as C); }
    public get leftFriend(){ return this.node.leftFriend?.data; }
    public get rightFriend(){ return this.node.rightFriend?.data;}

    public readonly event:Event<{
        adopt: <T1 extends C>(member:T1)=>void,
        remove: ()=>void,
        bringDown: (obj:WebObject)=>void,
        bringUp: (obj:WebObject)=>void
    }>

    public static new
      <C extends WebObject,
       P extends WebObject,
       T extends WebObject>(obj:T){
        return new Family<C,P,T>(obj)
    }
    private constructor(obj:T){
        this.node = new TreeNode(engine.hierarchy, obj)
        this.event = {
            adopt: new EventQueue(),
            remove: new EventQueue(),
            bringDown: new EventQueue(),
            bringUp: new EventQueue()
        }
    }
    // as parent
    public adopt<T1 extends C>(member:T1):T1{
        this.event.adopt.invoke(member)
        this.node.tree.insert(this.node, member.family.node)
        return member;
    }
    public adoptAll(members?:C[]):T{
        for (let m of (members??[])) this.adopt(m)
        return this.me
    }
    public empty(){
        this.node.children.forEach(c => c.data!.family.remove())
        return this.me
    }

    // as friend
    public remove(){
        this.node.tree.remove(this.node)
        return this.me
    }
    public bringDown(obj:WebObject){
        this.node.tree.insertAsRightFriend(this.node, obj.family.node)
        return this.me
    }
    public bringUp(obj:WebObject){
        this.node.tree.insertAsLeftFriend(this.node, obj.family.node)
        return this.me
    }
    public promote(){
        this.leftFriend?.family?.bringUp?.(this.me)
        return this.me
    }
    public demote(){
        this.rightFriend?.family?.bringDown?.(this.me)
        return this.me
    }
}