import { TreeNode } from "@/data-structure/tree";
import { Nebula } from "../backend/data/Data";
import context from "./context";
import { receiveMessage } from "./utils/utils";

export async function toggleRecord(){
    if (!context.selection.content) return;
    context.isRecordingContent = !context.isRecordingContent;
}
export async function createNebulaByStart(){
    if (!context.selection.content) return;
    const nebulaName = await receiveMessage("새 네뷸라의 이름을 입력해주세요.");
    if (nebulaName === "") return;
    context.selection.universe = context.data.systemUniverse;
    context.selection.nebula = context.data.addNebula(new Nebula({name: nebulaName}))
    context.selection.nebula!.tree.insert(new TreeNode(context.selection.content.data))
}
export function closeCurrentTab(){
    const index = context.tabs.indexOf(context.selection);
    if (index >= 1){
        context.selection = context.tabs[index - 1]
        context.tabs.splice(index, 1)
    }
    else if (index === 0){
        if (context.tabs.length <= 1){
            const selection = {};
            context.selection = selection;
            context.tabs.splice(0, 1);
            context.tabs.push(selection);
        }
        else {
            context.selection = context.tabs[1];
            context.tabs.splice(0, 1);
        }
    }
}