import { li } from "@/funcObject";
import "./selli.css"

export const selli = (attributes?:any) => (...children:HTMLElement[]) => {
  const obj = li(attributes)(...children);
  
  obj.addEventListener("click", () => {
    const neighbors = obj.parentElement?.children;
    if (!neighbors) return;
    for (const n of neighbors){
      n.classList.remove("selected")
    }
    obj.classList.add("selected")
  })

  return obj;
}