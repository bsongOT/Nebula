import { Repeat } from "@/engine";
import { div } from "@/funcObject";
import context from "../../context";

export function FileAliasPage(){
    return (
        div({
            inlineStyle: {
                position: 'fixed',
                top: '0',
                left: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px) brightness(80%)',
                width: '100%',
                height: '100%',
                zIndex: '2'
            },
            onclick: function() {
                (this as HTMLElement).remove();
            }
        })(
            div({
                onclick: e => e.stopPropagation(),
                inlineStyle: {
                    background: 'white',
                    width: '80%',
                    height: '80%',
                    borderRadius: '10px',
                    boxShadow: '2px 2px 4px #aaa',
                    padding: '15px'
                }
            })(
                div()(
                    Repeat(
                        i => div({
                            inlineStyle: {
                                padding: '5px 10px',
                                display: 'flex'
                            }
                        })(
                            div({
                                inlineStyle: {
                                    border: '1px solid red',
                                    padding: '5px 10px',
                                    marginRight: '5px',
                                    borderRadius: '5px',
                                    boxShadow: '2px 2px 4px #ccc',
                                    background: "lightsalmon"
                                }
                            })(() => i.key),
                            div({
                                className: "hover-eee",
                                inlineStyle: {
                                    flexGrow: "1",
                                    border: '1px solid red',
                                    borderRadius: '5px',
                                    boxShadow: '2px 2px 4px #ccc',
                                    padding: "5px"
                                },
                                onclick: async () => {
                                    const workspacePath = await window.electron.getWorkspace();
                                    const selectedPath = await window.electron.openDialogFile();
                                    if (selectedPath.startsWith(workspacePath + "/")){
                                        context.data.fileAliases[i.key] = selectedPath.replace(workspacePath + "/", "")
                                    }
                                }
                            })(() => i.value)
                        ),
                        () => Object.entries(context.data.fileAliases).map(e => ({
                            key: e[0],
                            value: e[1]
                        }))
                    )
                )
            )
        )
    )
}