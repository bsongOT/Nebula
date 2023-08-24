class TaskContainer extends WebObject{
  constructor(){
    super("ol")
    this.element.innerHTML = tasks.map(t =>
      `<li>${t.content.title}</li>`).join("")
  }
}