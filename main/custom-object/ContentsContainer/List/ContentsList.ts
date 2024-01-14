import {WSelectableList} from "@/objects/list/"
import {ContentItem } from "../"
import {Content} from "../../../data/Data"
import { DataCollection } from "../../../data/DataCollection";

const contentsList = 
  new WSelectableList<Content>()
    .class.add("contents-list");

function update(contents:DataCollection<Content>){
    contentsList.family.empty();

    for (let c of contents.all()){
      let spoiled = false;
      const sm = search.mode;

        if (!testBySearch(c)){
          if (sm === "omit") continue;
          if (sm === "spoil") spoiled = true;
        }
      
        const fr = testByFilter(c)

        if (fr !== true){
          if (fr === "omit") continue;
          if (fr === "spoil") spoiled = true;
        }
      
      const item = contentsList.family.adopt(contentItem(c))
      if (spoiled) item.class.add("filtered")
    }
}