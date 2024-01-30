import { Family } from "@/factors/Family";
import { Input } from "@/factors/Input";

export abstract class WebObject{
  public readonly family:Family<WebObject, WebObject, this>;
  public readonly input:Input<this>;
  constructor(){
    this.family = Family.new(this)
    this.input = Input.new(this)
  }
}