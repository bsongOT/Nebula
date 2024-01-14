import {WButton} from "@/objects"
import {data, Content, Nebula} from "../../data/Data"
import { no_open_target } from "../../messages";

const openButton = 
  btn("Open")
    .input.onclick(()=>{
      if (!target) return alert(no_open_target)
      if (target instanceof Content){
        data.selectedContent = target;
        window.open("../../pages/content-page/content-page.html", "_self")
      }
      else if (target instanceof Nebula){
        data.selectedNebula = target;
        window.open("../../pages/nebula/nebula.html", "_self")
      }
    })
