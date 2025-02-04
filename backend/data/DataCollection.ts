import { DataComponent } from "./components/DataComponent";

export class DataCollection<T extends DataComponent> {
  private array:T[];
  constructor(array?:T[]) {
    this.array = array ?? [];
  }
  public all(){
    return [...this.array]
  }
  public get(id:number):T|undefined{
    if (isNaN(id)) return;
    if (this.array.length <= 0) return;
    if (this.array.at(-1)!.id < id) return;
    if (this.array[0].id > id) return;

    return this.array[this.binarySearch(0, this.array.length - 1, id)]
  }
  public add(item:T){
    if (this.array.length <= 0) item.id = 0;
    else item.id = this.array.at(-1)!.id + 1;
    this.array.push(item)
    return item;
  }
  public remove(id:number){
    this.array.splice(this.binarySearch(0,this.array.length - 1, id), 1)
  }
  public map<U>(func:(value:T, index?:number, array?:T[])=>U){
    return this.array.map(func)
  }
  public filter(func:(value:T, index?:number, array?:T[])=>boolean){
    return this.array.filter(func)
  }
  public find(func:(value:T, index:number, array:T[])=>boolean){
    return this.array.find(func)
  }
  private binarySearch(start:number, end:number, value:number):number {
    const arr = this.array;
    if (arr[start].id > value) return -1;
    if (arr[end].id < value) return -1;
    if (arr[start].id === value) return start;
    if (arr[end].id === value) return end;
    if (start === end) return -1;

    const t = Math.floor((start + end) / 2);
    if (arr[t].id >= value) return this.binarySearch(start, t, value)
    else return this.binarySearch(t, end, value)
  }
}
