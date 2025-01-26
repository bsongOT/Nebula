"use strict";
exports.__esModule = true;
exports.ElectronAPI = void 0;
var electron_1 = require("electron");
var ElectronAPI = /** @class */ (function () {
    function ElectronAPI() {
        this.workspaceExists = function () { return electron_1.ipcRenderer.invoke('workspace-exists'); };
        this.setWorkspace = function (path) { return electron_1.ipcRenderer.invoke('set-workspace', path); };
        this.getWorkspace = function () { return electron_1.ipcRenderer.invoke("get-workspace"); };
        this.selectWorkspace = function () { return electron_1.ipcRenderer.invoke('select-workspace'); };
        this.read = function (path) { return electron_1.ipcRenderer.invoke('read', path); };
        this.write = function (path, text) { return electron_1.ipcRenderer.invoke('write', path, text); };
        this.exists = function (relativePath) { return electron_1.ipcRenderer.invoke("exists", relativePath); };
        this.openDialogFile = function () { return electron_1.ipcRenderer.invoke("open-dialog-file"); };
    }
    return ElectronAPI;
}());
exports.ElectronAPI = ElectronAPI;
electron_1.contextBridge.exposeInMainWorld('electron', new ElectronAPI());
