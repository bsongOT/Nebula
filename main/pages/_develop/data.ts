import { body, div, li, span, ul } from "@/funcObject";
import { data } from "../../data/Data";
import { DataCollection } from "../../data/DataCollection";
import { Tree } from "@/data-structure/tree";

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
      li()(span()("Dust")),
      li()(span()("Content")),
      li()(span()("Nebula")),
      li()(span()("Universe")),
      li()(span()("Relation"))
    )
)