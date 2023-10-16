import { TreeList } from "@/objects/list/";
import { BodyObject, Container, Text } from "@/objects";
import { data } from "../../data/Data";
import { UpperMenu } from "../../custom-object";

new BodyObject([
    new UpperMenu(),
    new Container().addClass("figure"),
    new TreeList(data.selectedContent.body.claimTree).addClass("claims")
])