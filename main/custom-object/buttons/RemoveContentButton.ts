import { WButton } from "@/objects"
import {Content, data} from "../../data/Data"
import { btn } from "@/funcObject";

const removeContentButton = 
    btn("🗑")
    .input.onclick(()=>{
      if (!target) return;
      data.contents.remove(target.id)
    })