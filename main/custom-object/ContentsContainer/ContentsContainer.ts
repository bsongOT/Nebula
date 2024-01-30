
import { WContainer, WDetail } from "@/objects/"
import { Content, Data, Nebula } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import "../../styles/ContentsContainer.css"
import "../../styles/Tool-box.css"
import { btn, checkbox, div, drli, drul, inputText, multiselect, span, statebox, sul } from "@/funcObject";
import { FilterItem } from "./FilterItem";
import { contentItem } from "./ContentItem";
import { hangulSeperate } from "@/utils/utils";
import { WCheckbox } from "@/objects/input";
import { WSelectableItem } from "@/objects/list";

export class ContentsList extends WContainer{
  public readonly update:()=>void;
  public readonly onselect:(onselect:()=>void)=>this;
  public get selection(){return this.getSelection()}
  public set selection(v){this.setSelection(v)}

  constructor(data:Data){
    super()
    
    this.getSelection = () => list.selection;
    this.setSelection = (v) => list.selection = v;
    this.update = () => {
      list.family.empty();
      for (let c of data.contents.all()){
        const result = filter.test(c);

        if (result === "omit") continue;
        if (result === "spoil"){
          list.family.adopt(contentItem(c))
          list.class.add("filtered")
        }
        if (result === "pass"){
          list.family.adopt(contentItem(c))
        }
      }
    }
    this.onselect = (onselect) => {
      list.onselect(onselect)
      return this;
    }

    const list = sul<Content>({class: "contents-list"})();
    const filter = new Filter(data, this.update)
  
    this.class.add("contents-list-view")
    this.family.adoptAll([
      new Search(this.update),
      div({class: "tool-box"})(
        filter,
        new SortTool(this.update),
        new Checker()
      ),
      list
    ])
  }

  private readonly getSelection:()=>WSelectableItem<Content>|undefined
  private readonly setSelection:(v?:WSelectableItem<Content>)=>void
}
class Search extends WContainer {
  public readonly test:(content:Content)=>"pass"|"omit"|"spoil"
  constructor(listUpdate:()=>void){
    super();
    this.class.add("search")

    const mode = statebox("Omit", "Spoil").class.add("filter-mode").onchange(listUpdate)
    const text = inputText().oninput(listUpdate)

    this.family.adoptAll([
      span("🔍").class.add("search-icon"),
      text,
      mode
    ])

    this.test = (content:Content) => {
      const sepTitle = hangulSeperate(content.title)
      const sepSearch = hangulSeperate(text.value)
                
      if (sepTitle.includes(sepSearch)) return "pass"
      if (mode.value === "Omit") return "omit"
      return "spoil"
    }
  }
}
class Filter extends WDetail {
  public readonly test:(content:Content)=>"pass"|"omit"|"spoil";
  constructor(data:Data, listUpdate:()=>void){
    const filterBox = div({class: "filter-box"})()
    const addFilter = () => {
      filterBox.family.adopt(new FilterItem(listUpdate, data))
      listUpdate()
    }

    const toggle = btn("Filter");
    const main = div({class: "filter"})(
      btn("add filter")
        .class.add("add-filter-button")
        .input.onclick(addFilter),
      filterBox
    )
    super(toggle, main)
    this.test = (content) => {
      const filters = filterBox.family.children as FilterItem[];
      const testResults = filters.map(f => f.test(content))

      if (testResults.includes("omit")) return "omit"
      if (testResults.includes("spoil")) return "spoil"

      return "pass"
    }
  }
}
class SortTool extends WDetail {
  constructor(listUpdate:()=>void){
    const toggle = btn("Sort");
    const main = drul(
      drli(
        checkbox().label("가나다순")
      ),
      drli(
        checkbox().label("생성일자순")
      ),
      drli(
        checkbox().label("수정일자순")
      )
    )
    super(toggle, main)
  }
}
class Checker extends WDetail {
  constructor(){
    const toggle = btn("Checker")
    const main = div({})(
      multiselect<Nebula>(),
      multiselect<Content>()
    )
    super(toggle, main)
  }
}