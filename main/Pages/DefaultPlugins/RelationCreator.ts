import { U } from "@/engine";
import { btn } from "@/funcObject";
import context from "../../context";
import { Relation } from "../../data/components/Relation";
import { Nebula } from "../../data/Data";

export function RelationCreator(){
    const onclick = () => {
      if (context.selectedNebulas.size !== 2) return;
      if (!context.selection.universe) return;
      const nebs = [...context.selectedNebulas];
      const relation = context.data.relations.add(new Relation({
        mainTree: nebs[0],
        secondTree: nebs[1]
      }))
      context.selection.universe.relations.push(relation)
    }
    const inlineStyle = {
      marginLeft: "10px",
      marginTop: "10px"
    };
    const disabled = U(() => context.selectedNebulas.size !== 2)
  
    return btn({onclick, inlineStyle, disabled})("R")
  }