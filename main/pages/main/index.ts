import {BodyObject,
  UpperMenu,
  ContentsContainer,
  AddContentButton,
  RemoveContentButton,
  OpenButton,
  StartNebulaButton
} from "../../custom-object"
import {data} from "../../data/Data"

let cc;
let obtn, snbtn, acbtn, rmcbtn;
new BodyObject([
  new UpperMenu(),
  cc = new ContentsContainer(data.getContents())
     .onselect(function(){
        rmcbtn.target = this.selection?.content
        obtn.target = this.selection?.content
        obtn.kind = "content"
        snbtn.target = this.selection?.content
     }),
  obtn = new OpenButton(),
  snbtn = new StartNebulaButton(),
  acbtn = new AddContentButton().onclick(()=>cc.update()),
  rmcbtn = new RemoveContentButton().onclick(()=>cc.update())
])