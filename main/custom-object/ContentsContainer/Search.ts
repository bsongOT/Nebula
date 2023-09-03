import {Container, InputObject} from "../"
import {FilterMode} from "./Filter/FilterMode"
import {hangulSeperate} from "../../../engine/utils/utils"
import {Content} from "../../data/Data"
import {ChangableObjectOption} from "../../../engine/types"

export class Search extends Container{
  private modeObject:FilterMode;
  private input:InputObject;
  protected option:ChangableObjectOption;
  
  public get value(){
    return this.input.value;
  }
  public get mode(){
    return this.modeObject.value;
  }
  public constructor(option){
    super(option);
    this.addClass("search-input");
    [
      this.modeObject = new FilterMode(this),
      this.input = new InputObject()
    ].forEach(e => this.adopt(e));
    this.input.typing = () => this.change()
  }
  change(){
    this.option.onchange?.()
  }
  test(content:Content){
    const sepTitle = hangulSeperate(content.title)
    const sepSearch = hangulSeperate(this.value)
    
    return sepTitle.includes(sepSearch)
  }
}