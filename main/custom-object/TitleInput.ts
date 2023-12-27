import {InputObject} from "@/objects/input"

export class TitleInput extends InputObject{
  private nebula;
  constructor(nebula){
    super();
    this.nebula = nebula;
    this.value = nebula.name;
    this.addClass("title-input")
    this.onchange(()=>{})
  }
  onchange(onchange:()=>void){
    return super.onchange(()=>{
      this.nebula.name = this.value;
      onchange()
    })
  }
}