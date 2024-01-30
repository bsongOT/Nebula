import { Family } from "@/factors/Family"
import { Input } from "@/factors/Input"

export class WTest {
    public family:Family<any,any,any>
    public input:Input<this>
    constructor(){
        this.family = Family.new(this as any)
        this.input = Input.new(this)
    }
}