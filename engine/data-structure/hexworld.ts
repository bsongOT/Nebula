import { HexCoord } from "../coord-system/HexCoord";
import { emptyArr } from "../utils/utils";
import { HexGrid } from "./hexgrid";

export class HexWorld<T> extends HexGrid<T> {
    constructor(){
        super(new HexCoord(1,1,1))
    }
    setVal(h:HexCoord, v:T|undefined){
        const [x, y, z] = [this.size.x, this.size.y, this.size.z]
        if (v){
            const newSize = Math.ceil(Math.max(
                (h.x + h.y)/2, 
                (h.y + h.z)/2,
                Math.abs(h.x - h.z)
            )) + 1;

            for (let i=0;i<newSize-x;i++){
                this.datas.push(emptyArr(y+z-1), emptyArr(y+z-1))
                this.datas.forEach(l => l.push(undefined, undefined))
            }
            if (newSize > x)
                this.size = new HexCoord(1,1,1).scale(newSize)
            super.setVal(h, v)
        }
        else {
            super.setVal(h, v)
        }
    }
}