import { WebObject } from "../WebObject";
import { InputObject } from "./InputObject";
import { Text } from "../Text"

export class SimpleRadio extends InputObject{
  public get name(){
    return this.element.name;
  }
  public set name(v:string){
    this.element.name = v;
  }
  public get checked():boolean{
    return this.element.checked;
  }
  constructor(name:string){
    super()
    this.element.type = "radio";
    this.element.name = name;
  }
}
export class Radio extends WebObject<WebObject<any,any>, WebObject<any,any>>{
    private $radio:SimpleRadio;
    private $checkedPrev:boolean
    private $label:Text;
    public get value(){
        return this.$radio.value;
    }
    public get checked(){
        return this.$radio.checked;
    }
    constructor(name: string){
        let radio:SimpleRadio;
        super("label", [
            radio = new SimpleRadio(name)
        ])
        this.$radio = radio;
        this.addClass("radio")
        this.$checkedPrev = false;
        setInterval(()=>{
          if (this.$checkedPrev === this.checked) return;
          if (this.checked) this.addClass("checked")
          else this.removeClass("checked")
          this.$checkedPrev = this.checked;
        }, 20)
    }
    public onchange(onchange:()=>void){
        this.$radio.onchange(onchange)
    }
    public label(text:string){
      if (this.$label)
        this.$label.value = text;
      else
        this.$label = this.adopt(new Text(text))
      return this;
    }
    public check(){
      this.element.click()
      return this;
    }
}