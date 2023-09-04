import {InputObject} from "./"

export class TitleInput extends InputObject{
  #nebula;
  constructor(nebula){
    super();
    this.#nebula = nebula;
    this.value = nebula.name;
    this.addClass("title-input")
  }
  onchange(onchange:()=>void){
    this.#nebula.name = this.value;
    return this;
  }
}