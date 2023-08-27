import {WebObject} from "./"

export class TaskContainer extends WebObject{
  constructor(){
    super("ol")
    this.element.innerHTML = data.tasks.map(t =>
      `<li>${t.content.title}</li>`).join("")
  }
}