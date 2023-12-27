import { Coord } from "@/coord-system";
import { Form } from "./Form";

export class LineForm extends Form {
    public start:Coord;
    public end:Coord;

    constructor(){
        super()
        this.start = new Coord(0, 0)
        this.end = new Coord(0, 0)
    }

    public moveStart(coord:Coord){
        this.moveStartAt(this.start.add(coord))
        return this;
    }
    public moveStartAt(coord:Coord){
        this.start = coord;
        return this;
    }
    public moveEnd(coord:Coord){
        this.moveEndAt(this.end.add(coord))
        return this;
    }
    public moveEndAt(coord:Coord){
        this.end = coord;
        return this;
    }
}