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
const body = new BodyObject([
  new UpperMenu(),
  cc = new ContentsContainer(
    {contents: data.contents,
     onselect: function(){
        rmcbtn.target = this.selection?.content
        obtn.target = this.selection?.content
        obtn.kind = "content"
        snbtn.target = this.selection?.content
    }}
  ),
  obtn = new OpenButton(),
  snbtn = new StartNebulaButton(),
  acbtn = new AddContentButton({onadded: ()=>cc.update()}),
  rmcbtn = new RemoveContentButton({onremoved: ()=>cc.update()})
])