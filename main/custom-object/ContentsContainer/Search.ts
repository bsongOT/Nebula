import {Container, Text} from "@/objects"
import {FilterMode} from "./Filter/FilterMode"
import {hangulSeperate} from "@/utils/utils"
import {Content} from "../../data/Data"
import { InputText } from "@/objects/input/InputText";
import "../../styles/Search.css"
import { InputObject } from "@/objects/input";

export class Search extends Container{
  private $mode:FilterMode;
  private input:InputObject;
  private $onchange:()=>void;

  public get value(){
    return this.input.value;
  }
  public get mode(){
    return this.$mode.value;
  }
  public constructor(){
    super();
    this.addClass("search");
    [
      new Text("🔍").addClass("search-icon"),
      this.input = new InputText().ontyping(() => this.update()),
      this.$mode = new FilterMode(this)
    ].forEach(e => this.adopt(e));
  }
  update(){
    this.$onchange?.()
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