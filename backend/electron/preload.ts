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
}

contextBridge.exposeInMainWorld('electron', new ElectronAPI())