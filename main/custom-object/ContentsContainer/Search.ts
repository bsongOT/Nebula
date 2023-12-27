import {WContainer, WText} from "@/objects"
import {FilterMode} from "./Filter/FilterMode"
import {hangulSeperate} from "@/utils/utils"
import {Content} from "../../data/Data"
import { InputText } from "@/objects/input/WInputText";
import "../../styles/Search.css"

export class Search extends WContainer{
  private $mode:FilterMode;
  private $input:InputText;

  public get value(){
    return this.$input.value;
  }
  public get mode(){
    return this.$mode.value;
  }
  public constructor(){
    super();
    this.class.add("search");
    [
      new WText("🔍").class.add("search-icon"),
      this.$input = new InputText().event.ontyping(() => this.event.change.invoke()),
      this.$mode = new FilterMode(this)
    ].forEach(e => this.family.adopt(e));
  }
  test(content:Content){
    const sepTitle = hangulSeperate(content.title)
    const sepSearch = hangulSeperate(this.value)
    
    return sepTitle.includes(sepSearch)
  }
}