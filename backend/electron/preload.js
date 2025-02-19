"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronAPI = void 0;
const electron_1 = require("electron");
class ElectronAPI {
    constructor() {
        this.workspaceExists = () => electron_1.ipcRenderer.invoke('workspace-exists');
        this.setWorkspace = (path) => electron_1.ipcRenderer.invoke('set-workspace', path);
        this.getWorkspace = () => electron_1.ipcRenderer.invoke("get-workspace");
        this.selectWorkspace = () => electron_1.ipcRenderer.invoke('select-workspace');
        this.read = (path) => electron_1.ipcRenderer.invoke('read', path);
        this.write = (path, text) => electron_1.ipcRenderer.invoke('write', path, text);
        this.exists = (relativePath) => electron_1.ipcRenderer.invoke("exists", relativePath);
        this.openDialogFile = () => electron_1.ipcRenderer.invoke("open-dialog-file");
        this.getGitChanges = (contentName) => electron_1.ipcRenderer.invoke("get-git-changes", contentName);
        this.gitListFiles = () => electron_1.ipcRenderer.invoke("git-list-files");
        this.gitCommit = () => electron_1.ipcRenderer.invoke("git-commit");
        this.gitStatus = () => electron_1.ipcRenderer.invoke("git-status");
        this.getDirectory = (path) => electron_1.ipcRenderer.invoke("get-directory", path);
        this.removeFile = (path) => electron_1.ipcRenderer.invoke("remove-file", path);
    }
}
exports.ElectronAPI = ElectronAPI;
electron_1.contextBridge.exposeInMainWorld('electron', new ElectronAPI());
