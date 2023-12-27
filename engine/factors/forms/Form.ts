import {Coord} from "../../coord-system"

export class Form {
    public position:Coord;
    constructor(){
        this.position = new Coord(0, 0);
    }
    public move(x:number, y?:number){
        this.moveAt(this.position.x + x, this.position.y + (y??0))
        return this;
    }
    public moveAt(x:number, y:number){
        this.position = new Coord(x, y)
        return this;
    }
}