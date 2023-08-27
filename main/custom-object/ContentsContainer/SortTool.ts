import {Container, InputObject} from "../"

export class SortTool extends Container{
  constructor(){
    super({class: "sort-tool"});
    [
      new Container({}, [
        new InputObject({type: "checkbox"}),
        new Container({value: "생성 날짜순"})
      ])
    ].forEach(e => this.adopt(e))
  }
}