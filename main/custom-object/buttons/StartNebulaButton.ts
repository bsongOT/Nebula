import { data, Content } from "../../data/Data"
import { btn } from "@/funcObject";

export const startNebulaButton = 
  btn("start nebula").input.onclick(()=>{
    if (!target) return;
    data.selectedNebula = data.addNebula(
      target.title, "Story", target)

    window.open("./nebula.html", "_self")
  })