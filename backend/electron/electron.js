"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const main_1 = require("electron/main");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const electron_store_1 = __importDefault(require("electron-store"));
const simple_git_1 = require("simple-git");
main_1.app.commandLine.appendSwitch('disable-site-isolation-trials');
const createWindow = () => __awaiter(void 0, void 0, void 0, function* () {
    const store = new electron_store_1.default();
    const window = new main_1.BrowserWindow({
        width: 1300,
        height: 770,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        },
        icon: path.join(__dirname, "../../logo.icns")
    });
    let git;
    if (store.get("workspace-path") === undefined) {
        store.set("workspace-path", "");
    }
    else if (fs.existsSync(store.get("workspace-path"))) {
        git = (0, simple_git_1.simpleGit)(store.get("workspace-path"));
        git.addConfig("core.quotepath", "false");
        if (!fs.existsSync(`${store.get("workspace-path")}/.git`)) {
            yield git.init();
        }
        if (!fs.existsSync(`${store.get("workspace-path")}/.gitignore`)) {
            fs.writeFileSync(store.get("workspace-path") + "/.gitignore", ".DS_Store", { flag: "w" });
        }
        electron_1.ipcMain.handle('git-diff-lines', (_, relativePath) => __awaiter(void 0, void 0, void 0, function* () {
            const diffs = yield git.diff(["--unified=0", "--", relativePath]);
            const diffLines = diffs.split("\n");
            if (diffLines.length === 0)
                return [];
            let deletedLineNum = 0;
            let insertedLineNum = 0;
            return diffLines.slice(diffLines.findIndex(l => l.startsWith("@@"))).map(l => {
                if (l.startsWith("@@")) {
                    const parts = l.split(" ");
                    deletedLineNum = Number(parts[1].slice(1).split(",")[0]);
                    insertedLineNum = Number(parts[2].slice(1).split(",")[0]);
                    const str = l.slice(l.indexOf(" @@") + 3);
                    if (str === "") {
                        return {
                            state: "no-change",
                            str: str,
                            index: -1
                        };
                    }
                    return {
                        state: "no-change",
                        str: str,
                        index: insertedLineNum - 1
                    };
                }
                if (l.startsWith("+")) {
                    return {
                        state: "insert",
                        str: l.slice(1),
                        index: insertedLineNum++
                    };
                }
                if (l.startsWith("-")) {
                    return {
                        state: "delete",
                        str: l.slice(1),
                        index: deletedLineNum++
                    };
                }
                return {
                    state: "no-change",
                    str: l.slice(1),
                    index: -1
                };
            }).filter(i => i.index !== -1);
        }));
        electron_1.ipcMain.handle('get-git-changes', (_, contentName) => __awaiter(void 0, void 0, void 0, function* () {
            const diffs = yield git.diff(['--unified=0']);
            const lines = diffs.split("\n");
            const targetStart = lines.findIndex(l => l.startsWith('diff --git') && l.endsWith(`${contentName}.md`));
            if (targetStart < 0)
                return [];
            const targetEndExpect = lines.findIndex((l, i) => l.startsWith('diff --git') && i > targetStart);
            const targetEnd = targetEndExpect >= 0 ? targetEndExpect : lines.length;
            return (lines
                .slice(targetStart, targetEnd)
                .filter(l => l.startsWith("@@"))
                .map(l => {
                const part = l.split(' ').find(p => p.startsWith("+"));
                if (part === undefined)
                    return [];
                const numbers = part.slice(1).split(",");
                const startLine = Number(numbers[0]);
                const numLines = numbers.length > 1 ? Number(numbers[1]) : 1;
                return Array.from({ length: numLines }).fill(0).map((_, i) => startLine + i);
            }).flat());
        }));
        electron_1.ipcMain.handle('git-list-files', () => __awaiter(void 0, void 0, void 0, function* () {
            return yield git.raw(['ls-files']);
        }));
        electron_1.ipcMain.handle('git-status', () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield git.status();
            return {
                untracked: status.not_added,
                modified: status.modified,
                deleted: status.deleted
            };
        }));
        electron_1.ipcMain.handle('git-commit', (_, message) => __awaiter(void 0, void 0, void 0, function* () {
            yield git.add(".");
            yield git.commit(message === "" ? "-" : message);
        }));
        electron_1.ipcMain.handle('git-commit-history', () => __awaiter(void 0, void 0, void 0, function* () {
            const log = yield git.log();
            return log.all.map(({ date, hash, message }) => ({ date, hash, message }));
        }));
    }
    electron_1.ipcMain.handle('get-directory', (_, relativePath) => __awaiter(void 0, void 0, void 0, function* () {
        const fullPath = path.join(store.get("workspace-path"), relativePath);
        if (!fs.existsSync(fullPath))
            return undefined;
        return fs.readdirSync(fullPath);
    }));
    electron_1.ipcMain.handle('remove-file', (_, relativePath) => __awaiter(void 0, void 0, void 0, function* () {
        fs.rmSync(path.join(store.get("workspace-path"), relativePath));
    }));
    electron_1.ipcMain.handle('workspace-exists', () => {
        return fs.existsSync(store.get("workspace-path"));
    });
    electron_1.ipcMain.handle('set-workspace', (_, path) => {
        if (path === undefined || path == '')
            return;
        store.set("workspace-path", path);
        git = (0, simple_git_1.simpleGit)(store.get("workspace-path"));
    });
    electron_1.ipcMain.handle('get-workspace', () => store.get("workspace-path"));
    electron_1.ipcMain.handle('get-workspaces', () => {
        var _a, _b;
        return (_b = (_a = store.get("workspace-paths")) === null || _a === void 0 ? void 0 : _a.split("\n")) !== null && _b !== void 0 ? _b : [];
    });
    electron_1.ipcMain.handle('select-workspace', () => {
        var _a, _b, _c;
        const path = (_a = electron_1.dialog.showOpenDialogSync(window, {
            properties: ['openDirectory']
        })) === null || _a === void 0 ? void 0 : _a[0];
        if (!path)
            return false;
        store.set('workspace-path', path);
        const workspaces = (_c = (_b = store.get("workspace-paths")) === null || _b === void 0 ? void 0 : _b.split("\n")) !== null && _c !== void 0 ? _c : [];
        if (!(workspaces === null || workspaces === void 0 ? void 0 : workspaces.includes(path))) {
            workspaces.push(path);
            store.set("workspace-paths", workspaces.join("\n"));
        }
        return true;
    });
    electron_1.ipcMain.handle('read', (_, relativePath) => {
        const targetPath = path.join(store.get("workspace-path"), relativePath);
        if (fs.existsSync(targetPath))
            return fs.readFileSync(targetPath, "utf8").toString();
        return "";
    });
    electron_1.ipcMain.handle('write', (_, relativePath, str) => {
        const workspacePath = store.get("workspace-path");
        const targetPath = path.join(workspacePath, relativePath);
        const relPath = targetPath.slice(workspacePath.length + 1);
        const pathRoad = relPath.split("/");
        let folderPath = workspacePath;
        for (let i = 0; i < pathRoad.length - 1; i++) {
            folderPath += `/${pathRoad[i]}`;
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }
        }
        fs.writeFileSync(targetPath, str, { flag: "w" });
    });
    electron_1.ipcMain.handle("exists", (_, relativePath) => {
        return fs.existsSync(path.join(store.get("workspace-path"), relativePath));
    });
    electron_1.ipcMain.handle("open-dialog-file", () => {
        var _a;
        const path = electron_1.dialog.showOpenDialogSync(window, {
            filters: [
                { name: "Assets", extensions: ["jpg", "png", "gif", "mp4", "avi", "mp3", "wav", "html"] },
            ],
            properties: ["openFile"]
        });
        return (_a = path === null || path === void 0 ? void 0 : path[0]) !== null && _a !== void 0 ? _a : "";
    });
    electron_1.protocol.handle("asset", req => {
        const filePath = path.join(store.get("workspace-path"), req.url.slice('asset://'.length));
        return electron_1.net.fetch("file://" + filePath);
    });
    window.loadURL("http://localhost:9000/");
    //window.loadFile("dist/index.html");
});
main_1.app.whenReady().then(() => {
    createWindow();
});
main_1.app.on('activate', () => {
    if (main_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
main_1.app.on('window-all-closed', () => {
    main_1.app.quit();
});
