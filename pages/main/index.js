import {BodyObject} from "../../objects/index.js"
import {
  UpperMenu,
  ContentsContainer,
  Search, Filter, SortTool,
  Checker, ContentsList,
  AddContentButton,
  RemoveContentButton,
  OpenButton,
  StartNebulaButton
} from "../../custom-object/index.js"
import {contents} from "../../data/Data.js"

let cc;
let ccs;
let ccf;
let obtn, snbtn, acbtn, rmcbtn;
const body = new BodyObject([
  new UpperMenu(),
  cc = new ContentsContainer(
    {contents: contents}, [
    ccs = new Search({onchange: ()=>cc.update()}),
    ccf = new Filter({onchange: ()=>cc.update()}),
    new SortTool(),
    new Checker(),
    new ContentsList({
      contents: contents, 
      filter: ccf, 
      search: ccs, 
      onselect: function(){
        rmcbtn.target = this.selection?.content
        obtn.target = this.selection?.content
        obtn.kind = "content"
        snbtn.target = this.selection?.content
    }})
  ]),
  obtn = new OpenButton(),
  snbtn = new StartNebulaButton(),
  acbtn = new AddContentButton({onadded: ()=>cc.update()}),
  rmcbtn = new RemoveContentButton({onremoved: ()=>cc.update()})
])