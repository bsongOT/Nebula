import { WBody } from "@/objects/";
import {UpperMenu,
  ContentsContainer,
  AddContentButton,
  RemoveContentButton,
  OpenButton,
  StartNebulaButton,
  ContentsList
} from "../../custom-object"
import {data} from "../../data/Data"
import "../style.css"

let cl:ContentsList;
let obtn, snbtn, acbtn, rmcbtn;

new WBody([
  new UpperMenu(),
  new ContentsContainer(data.contents).useComponents(({list})=>{
    cl = list!;
    cl.onselect(() => {
        rmcbtn.target = cl.selection?.value
        obtn.target = cl.selection?.value
        snbtn.target = cl.selection?.value
    })
  }),
  obtn = new OpenButton(),
  snbtn = new StartNebulaButton(),
  acbtn = new AddContentButton().onclick(()=>cl.update()),
  rmcbtn = new RemoveContentButton().event.onclick(()=>cl.update())
])