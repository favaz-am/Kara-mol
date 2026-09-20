import { app, BrowserWindow, session } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Forces Electron to allow the AI's audio to play automatically!
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    
    // --- YOUR AI PET SETTINGS ---
    width: 350,
    height: 350,
    transparent: true,    // Makes the background transparent
    frame: false,         // Removes title bar & buttons
    alwaysOnTop: true,    // Keeps the pet floating on top
    hasShadow: false,     // Removes drop shadow
    // ----------------------------

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Opens DevTools in a SEPARATE window so it doesn't squash your pet
  win.webContents.openDevTools({ mode: 'detach' })

  // Active window tracker (Sends screen data to React)
  win.webContents.on('did-finish-load', () => {
    setInterval(async () => {
      try {
        const moduleName = 'active-win';
        const { default: activeWindow } = await import(/* @vite-ignore */ moduleName);
        const winDetails = await activeWindow();
        
        if (winDetails && winDetails.owner) {
          win?.webContents.send('main-process-message', winDetails.owner.name);
        }
      } catch (error) {
        console.error('Error fetching active window:', error);
      }
    }, 2000); // Polls every 2 seconds
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  console.log("🚀 ELECTRON APP IS BOOTING UP!") 

  // Auto-grants microphone permissions for the AI
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true)
    } else {
      callback(false)
    }
  })

  createWindow()
})  