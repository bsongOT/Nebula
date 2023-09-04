import { ButtonObject } from "./ButtonObject"
import { Container } from "./Container"
import { WebObject } from "./WebObject"

export class Detail extends Container{
  constructor(children:[ButtonObject, WebObject<any,any>]){
    super([
      children[0].onclick(()=>{
        children[1].toggleClass("omitted-content")
      }),
      children[1]
    ])
  }
}