import { contextBridge, ipcRenderer } from 'electron'

export class ElectronAPI {
    workspaceExists = ():Promise<boolean> => ipcRenderer.invoke('workspace-exists');
    setWorkspace = (path:string):Promise<void> => ipcRenderer.invoke('set-workspace', path);
    getWorkspace = ():Promise<string> => ipcRenderer.invoke("get-workspace");
    getWorkspaces = ():Promise<string[]> => ipcRenderer.invoke("get-workspaces");
    selectWorkspace = ():Promise<void> => ipcRenderer.invoke('select-workspace');
    read = (path:string):Promise<string> => ipcRenderer.invoke('read', path);
    write = (path:string, text:string):Promise<void> => ipcRenderer.invoke('write', path, text);
    exists = (relativePath:string):Promise<boolean> => ipcRenderer.invoke("exists", relativePath);
    openDialogFile = ():Promise<string> => ipcRenderer.invoke("open-dialog-file");
    getGitChanges = (contentName:string):Promise<number[]> => ipcRenderer.invoke("get-git-changes", contentName);
    gitListFiles = ():Promise<string> => ipcRenderer.invoke("git-list-files")
    gitCommit = (message:string):Promise<void> => ipcRenderer.invoke("git-commit", message);
    gitCommitHistory = ():Promise<{date:string, hash:string, message:string}[]> => ipcRenderer.invoke("git-commit-history")
    gitStatus = ():Promise<{untracked: string[], modified: string[], deleted: string[]}> => ipcRenderer.invoke("git-status");
    gitDiffLines = (path:string):Promise<{state: "insert" | "delete", index:number, str:string}[]> => ipcRenderer.invoke("git-diff-lines", path)
    getDirectory = (path:string):Promise<string[] | undefined> => ipcRenderer.invoke("get-directory", path);
    removeFile = (path:string):Promise<void> => ipcRenderer.invoke("remove-file", path);
}

contextBridge.exposeInMainWorld('electron', new ElectronAPI())