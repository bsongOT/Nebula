import {Container, InputObject} from "../"
import {FilterMode} from "./Filter/FilterMode"
import {hangulSeperate} from "../../../engine/utils/utils"
import {Content} from "../../data/Data"

export class Search extends Container{
  private modeObject:FilterMode;
  private input:InputObject;
  private $onchange:()=>void;

  public get value(){
    return this.input.value;
  }
  public get mode(){
    return this.modeObject.value;
  }
  public constructor(){
    super();
    this.addClass("search-input");
    [
      this.modeObject = new FilterMode(this),
      this.input = new InputObject().ontyping(() => this.update())
    ].forEach(e => this.adopt(e));
  }
  update(){
    this.$onchange()
    return this;
  }
  onchange(onchange:()=>void){
    this.$onchange = onchange;
    return this;
  }
  test(content:Content){
    const sepTitle = hangulSeperate(content.title)
    const sepSearch = hangulSeperate(this.value)
    
    return sepTitle.includes(sepSearch)
  }
}