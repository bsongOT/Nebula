import {WebObject, ListView} from "../../objects/index.js"
import {data, contents} from "../../data/Data.js"
import {tour} from "../../utils/utils.js"

export class ContentsTreePanel extends ListView{
  #selection;
  get selection(){
    return this.#selection;
  }
  set selection(v){
    if (this.selection)
      this.#selection.color = "#ffffff00";
    v.color = "#a8a97c";
    this.#selection = v;
  }
  constructor(nebula){
    super()
    this.selection = this.adopt(
      new TreeItem(nebula.origin, this)
    )
    for (let c of nebula.directChildren){
      tour(c, 0, 0, n => {
        console.log(n)
      })
    }
  }
}
export class TreeItem extends WebObject {
  node;
  treePanel;
  #level;
  get level(){
    return this.#level;
  }
  set level(v){
    if (v < 0) return;
    if (this.sibling[0]){
      if (v > this.sibling[0].level + 1) return;
    }
    else if (v > this.parent.level + 1) return;
    
    if (v - this.#level > 0){
      this.sibling[0].adopt(this)
    }
    else{
      this.parent.bringDown(this)
    }
    
    this.#level = v;
  }
  constructor(node, treePanel){
    super();
    this.node = node
    this.treePanel = treePanel
    this.value = data.getContent(node.id).title;
    this.color = "#ffffff00"
    this.#level = 0;
    this.element.style.paddingLeft = 20+"px"
  }
  click(){
    event.stopPropagation()
    this.treePanel.selection = this;
  }
}