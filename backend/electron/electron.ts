import { protocol, net, ipcMain, dialog } from "electron";
import { app, BrowserWindow } from "electron/main";
import * as fs from 'fs';
import * as path from "path";
import * as S from "electron-store";

app.commandLine.appendSwitch('disable-site-isolation-trials')

const createWindow = async () => {
    const store = new (S as any)() as S<Record<string, string>>;
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        }
    });
    
    ipcMain.handle('workspace-exists', () => {
        return fs.existsSync(store.get("workspace-path"));
    })
    ipcMain.handle('set-workspace', (_, path) => {
        if (path === undefined || path == '') return;
        store.set("workspace-path", path);
    })
    ipcMain.handle('get-workspace', () => store.get("workspace-path"))
    ipcMain.handle('select-workspace', () => {
        const path = dialog.showOpenDialogSync(window, {
            properties: ['openDirectory']
        })?.[0]
        if (!path) return false;
        store.set('workspace-path', path);
        return true;
    })
    ipcMain.handle('read', (_, relativePath) => {
        const targetPath = path.join(store.get("workspace-path"), relativePath);
        if (fs.existsSync(targetPath)) return fs.readFileSync(targetPath, "utf8").toString();
        return "";
    })
    ipcMain.handle('write', (_, relativePath, str) => {
        const workspacePath = store.get("workspace-path");
        const targetPath = path.join(workspacePath, relativePath);
        const relPath = targetPath.slice(workspacePath.length + 1);
        const pathRoad = relPath.split("/");
        let folderPath = workspacePath;
        for (let i = 0; i < pathRoad.length - 1; i++){
            folderPath += `/${pathRoad[i]}`;
            if (!fs.existsSync(folderPath)){
                fs.mkdirSync(folderPath)
            }
        }
        fs.writeFileSync(targetPath, str, {flag: "w"});
    })
    ipcMain.handle("exists", (_, relativePath) => {
        return fs.existsSync(path.join(store.get("workspace-path"), relativePath))
    })
    ipcMain.handle("open-dialog-file", () => {
        const path = dialog.showOpenDialogSync(window, {
            filters: [
                { name: "Assets", extensions: ["jpg", "png", "gif", "mp4", "avi", "mp3", "wav", "html"] },
            ],
            properties: ["openFile"]
        })
        return path?.[0] ?? ""
    })
    protocol.handle("asset", req => {
        const filePath = path.join(store.get("workspace-path"), req.url.slice('asset://'.length));
        return net.fetch("file://" + filePath);
    })

    window.loadURL("http://localhost:9000/")
    //window.loadFile("dist/index.html");
}

app.whenReady().then(() => {
    createWindow();
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})