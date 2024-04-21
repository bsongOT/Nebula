import { span } from "@/funcObject";
import "../styles/StateBox.css"

export const statebox = (...states:string[]) => {
  if (states.length < 1) throw "one state is necessary at least"

  const sb = span({class: "state-box"})(states[0])

  let index = 0;

  sb.addEventListener("click", () => {
    sb.innerText = states[++index % states.length]
  })

  return sb;
}