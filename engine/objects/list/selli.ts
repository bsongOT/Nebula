import { li } from "@/funcObject";

export const selli = (...children:HTMLElement[]) => {
  const obj = li()(...children);
  
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