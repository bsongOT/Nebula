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
    const git = (0, simple_git_1.simpleGit)(store.get("workspace-path"));
    git.addConfig("core.quotepath", "false");
    if (!fs.existsSync(`${store.get("workspace-path")}/.git`)) {
        yield git.init();
    }
    if (!fs.existsSync(`${store.get("workspace-path")}/.gitignore`)) {
        fs.writeFileSync(store.get("workspace-path") + "/.gitignore", ".DS_Store", { flag: "w" });
    }
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
    electron_1.ipcMain.handle('get-directory', (_, relativePath) => __awaiter(void 0, void 0, void 0, function* () {
        return fs.readdirSync(path.join(store.get("workspace-path"), relativePath));
    }));
    electron_1.ipcMain.handle('remove-file', (_, relativePath) => __awaiter(void 0, void 0, void 0, function* () {
        fs.rmSync(path.join(store.get("workspace-path"), relativePath));
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
    electron_1.ipcMain.handle('git-commit', () => __awaiter(void 0, void 0, void 0, function* () {
        yield git.add(".");
        yield git.commit("-");
    }));
    electron_1.ipcMain.handle('workspace-exists', () => {
        return fs.existsSync(store.get("workspace-path"));
    });
    electron_1.ipcMain.handle('set-workspace', (_, path) => {
        if (path === undefined || path == '')
            return;
        store.set("workspace-path", path);
    });
    electron_1.ipcMain.handle('get-workspace', () => store.get("workspace-path"));
    electron_1.ipcMain.handle('select-workspace', () => {
        var _a;
        const path = (_a = electron_1.dialog.showOpenDialogSync(window, {
            properties: ['openDirectory']
        })) === null || _a === void 0 ? void 0 : _a[0];
        if (!path)
            return false;
        store.set('workspace-path', path);
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
    if (process.platform !== 'darwin')
        main_1.app.quit();
});
