export * from "./Content.js"
export * from "./Nebula.js"

const $ = (name) => localStorage.getItem(name)
const $$ = (name, value) => localStorage.setItem(name, value)

export class Data {
  contents;
  nebulas;
  playgrounds;
  relations;
  
  get selectedContent(){
    const id = Number($("selected-content"))
    return this.getContent(id)
  }
  set selectedContent(value){
    $$("selected-content", value.id)
  }
  get selectedNebula(){
    const id = Number($("selected-nebula"))
    return this.nebulas.find(n => n.id===id)
  }
  set selectedNebula(value){
    $$("selected-nebula", value.id)
  }
  
  constructor(){
    this.contents = JSON.parse($("all-contents")) ?? [];
    this.nebulas = JSON.parse($("all-nebulas")) ?? [];
    this.playgrounds = JSON.parse($("all-playgrounds")) ?? [];
    this.relations = JSON.parse($("all-relations")) ?? []
    setInterval(this.save, 1000)
  }
  
  getContent(id){
    if (isNaN(id)) return;
    return this.contents[binarySearchContent(0, this.contents.length - 1, id)];
  }
  
  save = ()=>{
    $$("all-contents", JSON.stringify(this.contents))
    $$("all-nebulas", JSON.stringify(this.nebulas))
    $$("all-playgrounds", JSON.stringify(this.playgrounds))
    $$("all-relations", JSON.stringify(this.relations))
  }
}

function binarySearchContent(start, end, value){
  if (contents[start].id > value) return;
  if (contents[end].id < value) return;
  if (contents[start].id === value) return start
  if (contents[end].id === value) return end
  
  const t = Math.floor((start + end) / 2);
  if (contents[t] >= value) 
    return binarySearchContent(start, t, value)
  else
    return binarySearchContent(t, end, value)
}

export let data = new Data()
export let contents = data.contents;
export let nebulas = data.nebulas;
export const selectedContent = data.selectedContent;
export const selectedNebula = data.selectedNebula