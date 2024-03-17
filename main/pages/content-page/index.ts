import { TreeList } from "@/objects/list/";
import { data } from "../../data/Data";
import { UpperMenu } from "../../custom-object";
import { body, div } from "@/funcObject";

if (!data.selectedContent) throw "error"

body(
    /*new UpperMenu(),
    div({class: "figure"})(),
    new TreeList(data.selectedContent.body.claimTree).class.add("claims")
*/)