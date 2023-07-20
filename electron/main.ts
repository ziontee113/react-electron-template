import { app, BrowserWindow, globalShortcut, Menu } from "electron";
import path from "node:path";

process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    // width: 1920,
    // height: 1080,
    transparent: true,
    frame: false,
    webPreferences: {
      // HACK: personal use only, extremely dangerous in production
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  win.webContents.on("before-input-event", (_, input) => {
    if (
      input.type === "keyDown" &&
      input.control &&
      input.shift &&
      input.key === "I"
    ) {
      if (win !== null) {
        win.webContents.isDevToolsOpened()
          ? win.webContents.closeDevTools()
          : win.webContents.openDevTools({ mode: "right" });
      }
    }
  });
}

Menu.setApplicationMenu(null); // disable window closing on <C-w>

app.on("window-all-closed", () => {
  win = null;
});

(async () => {
  await app.whenReady();

  globalShortcut.register("Alt+CommandOrControl+I", () => {
    console.log("Electron loves global shortcuts!");
  });

  createWindow();
})();
