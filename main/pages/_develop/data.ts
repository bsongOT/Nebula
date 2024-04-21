import { body, div, span, ul } from "@/funcObject";
import { data } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import { Tree } from "@/data-structure/tree";
import { selli } from "@/objects/UI/list/selli";

const wildData = elementify(data);
wildData.style.marginLeft= "0"
function elementify(data:any){
  const elt = div()()

  elt.style.marginLeft = "20px"

  if (data instanceof DataCollection){
    elt.append(...data.map(d => elementify(d)))
    return elt;
  }

  if (data instanceof Tree){
    return elt;
  }

  for (let k in data){
    if (typeof data[k] === 'object'){
        elt.append(span()(k + " : "), elementify(data[k]))
        continue;
    }
    elt.append(div()(span()(k + " : " + data[k])))
  }

  return elt;
}

body(
    wildData,
    ul()(
      selli()(span()("Dust")),
      selli()(span()("Content")),
      selli()(span()("Nebula")),
      selli()(span()("Universe")),
      selli()(span()("Relation"))
    )
)