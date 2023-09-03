import { StarTile } from "..";
import { Nebula } from "../../data/Data";
import { TreeItem } from "./TreeItem";

export class StarSpace {
  public listItem: TreeItem|undefined;
  public hexagon: StarTile;
  public nebula:Nebula;
  public get isSelected(){
    return this.listItem?.selected;
  }
  public get isValid(){
    return !!this.listItem;
  }
  public get isOrient(){
    return this.id === this.nebula.orient
  }
  public get id(){
    if (!this.listItem) return -1;
    return this.listItem.value.id
  }

  constructor(listItem: TreeItem, hexagon: StarTile) {
    this.listItem = listItem;
    this.hexagon = hexagon;
  }
  public select():StarSpace{
    if (!this.listItem) return this;

    this.listItem.parent.selection = this.listItem;

    return this;
  }
}
