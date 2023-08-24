import {BodyObject, ListView} from "../../objects/index.js"
import {UpperMenu} from "../../custom-object/index.js"
import {NebulaItem} from "../../custom-object/NebulaItem.js"
import {nebulas} from "../../data/Data.js"

const body = new BodyObject([
  new UpperMenu(),
  new ListView(nebulas.map(n => new NebulaItem(n)))
]);