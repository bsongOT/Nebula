import {InputObject} from "./"

export class TitleInput extends InputObject{
  #nebula;
  constructor(nebula){
    super();
    this.#nebula = nebula;
    this.value = nebula.name;
    this.addClass("title-input")
  }
  typing(){
    this.#nebula.name = this.value;
  }
}