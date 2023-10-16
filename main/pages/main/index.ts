import { BodyObject } from "@/objects/";
import {UpperMenu,
  ContentsContainer,
  AddContentButton,
  RemoveContentButton,
  OpenButton,
  StartNebulaButton
} from "../../custom-object"
import {data} from "../../data/Data"
import "../style.css"

let cc;
let obtn, snbtn, acbtn, rmcbtn;

new BodyObject([
  new UpperMenu(),
  cc = new ContentsContainer(data.contents)
      .onselect(function(){
        rmcbtn.target = this.selection?.value
        obtn.target = this.selection?.value
        snbtn.target = this.selection?.value
      }),
  obtn = new OpenButton(),
  snbtn = new StartNebulaButton(),
  acbtn = new AddContentButton().onclick(()=>cc.update()),
  rmcbtn = new RemoveContentButton().onclick(()=>cc.update())
])