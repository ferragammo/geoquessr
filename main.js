const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
      fullscreen: true, 
      resizable: false, 
      fullscreenable: true,
      autoHideMenuBar: true, 
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        enableRemoteModule: false,
        nodeIntegration: false, 
      },
    });
    
    mainWindow.setMenu(null);
  
    const startURL = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    });
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(startURL);
  
    mainWindow.on('closed', () => (mainWindow = null));
  };
  
  
  

app.on('ready', createWindow);

app.on('window-all-closed', () => {
   app.quit();
});


