import { protocol, net, ipcMain, dialog, nativeImage } from "electron";
import { app, BrowserWindow } from "electron/main";
import * as fs from 'fs';
import * as path from "path";
import Store from "electron-store";
import { SimpleGit, simpleGit } from "simple-git";

app.commandLine.appendSwitch('disable-site-isolation-trials')
protocol.registerSchemesAsPrivileged([{
    scheme: "asset",
    privileges: {
        bypassCSP: true,
        stream: true
    }
}])
const createWindow = async () => {
    const store = new Store<Record<string, string>>();
    const window = new BrowserWindow({
        width: 1300,
        height: 770,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        },
        icon: path.join(__dirname, "../../logo.icns")
    });
    let git:SimpleGit;
    if (store.get("workspace-path") === undefined){
        store.set("workspace-path", "");
    }
    else if (fs.existsSync(store.get("workspace-path"))){
        git = simpleGit(store.get("workspace-path"));
        git.addConfig("core.quotepath", "false")
        if (!fs.existsSync(`${store.get("workspace-path")}/.git`)){
            await git.init();
        }
        if (!fs.existsSync(`${store.get("workspace-path")}/.gitignore`)){
            fs.writeFileSync(store.get("workspace-path") + "/.gitignore", ".DS_Store", {flag: "w"});
        }

        ipcMain.handle('git-diff-lines', async (_, relativePath) => {
            const diffs = await git.diff(["--unified=0", "--", relativePath])
            const diffLines = diffs.split("\n");
            if (diffLines.length === 0) return []
            let deletedLineNum = 0;
            let insertedLineNum = 0;       
            return diffLines.slice(diffLines.findIndex(l => l.startsWith("@@"))).map(l => {
                if (l.startsWith("@@")){
                    const parts = l.split(" ");
                    deletedLineNum = Number(parts[1].slice(1).split(",")[0]);
                    insertedLineNum = Number(parts[2].slice(1).split(",")[0]);
                    const str = l.slice(l.indexOf(" @@") + 3);
                    if (str === "") {
                        return {
                            state: "no-change" as const,
                            str: str,
                            index: -1
                        }
                    }
                    return {
                        state: "no-change" as const,
                        str: str,
                        index: insertedLineNum - 1
                    };
                }
                if (l.startsWith("+")){
                    return {
                        state: "insert" as const,
                        str: l.slice(1),
                        index: insertedLineNum++
                    }
                }
                if (l.startsWith("-")){
                    return {
                        state: "delete" as const,
                        str: l.slice(1),
                        index: deletedLineNum++
                    }
                }
                return {
                    state: "no-change" as const,
                    str: l.slice(1),
                    index: -1
                }
            }).filter(i => i.index !== -1);
        })
        ipcMain.handle('get-git-changes', async (_, contentName) => {
            const diffs = await git.diff(['--unified=0']);
            const lines = diffs.split("\n");
            const targetStart = lines.findIndex(l => l.startsWith('diff --git') && l.endsWith(`${contentName}.md`));
            if (targetStart < 0) return [];
            const targetEndExpect = lines.findIndex((l, i) => l.startsWith('diff --git') && i > targetStart);
            const targetEnd = targetEndExpect >= 0 ? targetEndExpect : lines.length;

            return (
                lines
                    .slice(targetStart, targetEnd)
                    .filter(l => l.startsWith("@@"))
                    .map(
                        l => {
                            const part = l.split(' ').find(p => p.startsWith("+"))
                            if (part === undefined) return []
                            const numbers = part.slice(1).split(",");
                            const startLine = Number(numbers[0]);
                            const numLines = numbers.length > 1 ? Number(numbers[1]) : 1;

                            return Array.from({length: numLines}).fill(0).map((_, i) => startLine + i);
                        }
                    ).flat()
            )
        })
        ipcMain.handle('git-list-files', async () => {
            return await git.raw(['ls-files'])
        })
        ipcMain.handle('git-status', async () => {
            const status = await git.status()
            return {
                untracked: status.not_added,
                modified: status.modified,
                deleted: status.deleted
            };
        })
        ipcMain.handle('git-commit', async (_, message:string) => {
            await git.add(".");
            await git.commit(message === "" ? "-" : message);
        })
        ipcMain.handle('git-commit-history', async () => {
            const log = await git.log();
            return log.all.map(({date, hash, message}) => ({date, hash, message}))
        })
    }
    ipcMain.handle('get-directory', async (_, relativePath) => {
        const fullPath = path.join(store.get("workspace-path"), relativePath);
        if (!fs.existsSync(fullPath)) return undefined;
        return fs.readdirSync(fullPath);
    })
    ipcMain.handle('remove-file', async (_, relativePath) => {
        fs.rmSync(path.join(store.get("workspace-path"), relativePath))
    })
    ipcMain.handle('workspace-exists', () => {
        return fs.existsSync(store.get("workspace-path"));
    })
    ipcMain.handle('set-workspace', (_, path) => {
        if (path === undefined || path == '') return;
        store.set("workspace-path", path);
        git = simpleGit(store.get("workspace-path"));
    })
    ipcMain.handle('get-workspace', () => store.get("workspace-path"))
    ipcMain.handle('get-workspaces', () => {
        return store.get("workspace-paths")?.split("\n") ?? []
    })
    ipcMain.handle('select-workspace', () => {
        const path = dialog.showOpenDialogSync(window, {
            properties: ['openDirectory']
        })?.[0]
        if (!path) return false;
        store.set('workspace-path', path);
        const workspaces = store.get("workspace-paths")?.split("\n") ?? [];
        if (!workspaces?.includes(path)){
            workspaces.push(path);
            store.set("workspace-paths", workspaces.join("\n"))
        }
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
    app.quit()
})