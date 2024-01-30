import { TreeNode } from "@/data-structure/tree";
import { engine } from "@/engine";
import { WebObject } from "@/objects/WebObject";
import { EventQueue } from "./Event";

export type Event<T> = {
    [key in keyof T]:T[key] extends (...args:any[])=>void ? EventQueue<T[key]> : never
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

    //event
    public onremove(onremove:()=>void){
        this.event.remove.setListener(onremove)
        return this.me
    }
    public onadopt(onadopt:<T extends C>(member:T)=>void){
        this.event.adopt.setListener(onadopt)
        return this.me
    }
    public onbringDown(onbringDown:(obj:WebObject)=>void){
        this.event.bringDown.setListener(onbringDown)
        return this.me
    }
    public onbringUp(onbringUp:(obj:WebObject)=>void){
        this.event.bringUp.setListener(onbringUp)
        return this.me
    }

    //etc
    public tour(func:(n:WebObject)=>void){
        engine.hierarchy.tourNode(this.node, (n) => func(n.data!))
    }
}