import {WebObject, InputObject} from "../../objects/index.js"
import {FilterMode} from "./Filter/FilterMode.js"
import {hangulSeperate} from "../../utils/utils.js"

export class Search extends WebObject{
  #mode;
  #input;
  #onchange;
  
  get value(){
    return this.#input.value;
  }
  get mode(){
    return this.#mode.value;
  }
  constructor(option){
    super();
    this.addClass("search-input");
    [
      this.#mode = new FilterMode(this),
      this.#input = new InputObject()
    ].forEach(e => this.adopt(e));
    this.#onchange = option?.onchange;
    this.#input.typing = () => this.change()
  }
  change(){
    this.#onchange?.()
  }
  test(content){
    const sepTitle = hangulSeperate(content.title)
    const sepSearch = hangulSeperate(this.value)
    
    return sepTitle.includes(sepSearch)
  }
}