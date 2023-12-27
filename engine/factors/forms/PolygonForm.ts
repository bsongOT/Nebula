import { Coord } from "../../coord-system";
import { Form } from "./Form";

export class PolygonForm extends Form{
    public side:number;
    public color:string;
    constructor(){
        super()
        this.side = 10;
        this.color = "#000000";
    }
    public setSide(side:number){
        this.side = side;
        return this;
    }
    public setColor(color:string){
        this.color = color;
        return this;
    }
}