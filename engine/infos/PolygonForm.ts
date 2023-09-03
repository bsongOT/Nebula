import { Coord } from "../coord-system";
import { Form } from "./Form";

export class PolygonForm extends Form{
    public side:number;
    public color:string;
    constructor(position:Coord, side:number, color:string){
        super(position)
        this.side = side;
        this.color = color;
    }
}