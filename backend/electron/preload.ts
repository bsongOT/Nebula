import { contextBridge, ipcRenderer } from 'electron'

export class ElectronAPI {
    workspaceExists = ():Promise<boolean> => ipcRenderer.invoke('workspace-exists');
    setWorkspace = (path:string):Promise<void> => ipcRenderer.invoke('set-workspace', path);
    getWorkspace = ():Promise<string> => ipcRenderer.invoke("get-workspace");
    selectWorkspace = ():Promise<void> => ipcRenderer.invoke('select-workspace');
    read = (path:string):Promise<string> => ipcRenderer.invoke('read', path);
    write = (path:string, text:string):Promise<void> => ipcRenderer.invoke('write', path, text);
    exists = (relativePath:string):Promise<boolean> => ipcRenderer.invoke("exists", relativePath);
    openDialogFile = ():Promise<string> => ipcRenderer.invoke("open-dialog-file");
    getGitChanges = (contentName:string):Promise<number[]> => ipcRenderer.invoke("get-git-changes", contentName);
    gitListFiles = ():Promise<string> => ipcRenderer.invoke("git-list-files")
    gitCommit = ():Promise<void> => ipcRenderer.invoke("git-commit");
    gitStatus = ():Promise<{untracked: string[], modified: string[], deleted: string[]}> => ipcRenderer.invoke("git-status");
    getDirectory = (path:string):Promise<string[] | undefined> => ipcRenderer.invoke("get-directory", path);
    removeFile = (path:string):Promise<void> => ipcRenderer.invoke("remove-file", path);
}

contextBridge.exposeInMainWorld('electron', new ElectronAPI())