import { upperMenu } from "../../custom-object";
import { treeList } from "../../custom-object/StarListContainer/StarList";
import { data } from "../../data/Data";
import { body, div } from "@/funcObject";


body(
    upperMenu(),
    div({class: "kernel"})(),
    //treeList()
)