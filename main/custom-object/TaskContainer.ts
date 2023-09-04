import { data } from "../data/Data"
import {WebObject} from "./"

export class TaskContainer extends WebObject<any,any>{
  public get value(): any {
    throw new Error("Method not implemented.")
  }
  public set value(v: any) {
    throw new Error("Method not implemented.")
  }
  constructor(){
    super("ol")
    //this.element.innerHTML = data.tasks.map(t =>
    //  `<li>${t.content.title}</li>`).join("")
  }
}