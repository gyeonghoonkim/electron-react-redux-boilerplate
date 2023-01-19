const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const path = require('path')
const url = require('url')
const fs = require("fs")
const { getDirs } = require('./getDirs')
const { dirsJsonParse } = require('./dirsJsonParse')
const { getFilesInDir } = require('./getFilesInDir')
const { searchCheck } = require('./searchCheck')
const { download } = require('./download')

const isDevelopment = process.env.NODE_ENV === 'development';

let mainWindow = null;
let forceQuit = false;

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  });

  // mainWindow.loadFile(path.resolve(path.join(__dirname, '../renderer/index.html')));
  mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`)

  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      mainWindow.on('close', function (e) {
        if (!forceQuit) {
          e.preventDefault();
          mainWindow.hide();
        }
      });

      app.on('activate', () => {
        mainWindow.show();
      });

      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
  });

  if (isDevelopment) {
    // auto-open dev tools
    mainWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y);
          },
        },
      ]).popup(mainWindow);
    });
  }
});

const template = [];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


ipcMain.on('search_clicked', (event, arg) => {
  const status = searchCheck(arg['searchValue'])
  { (status === 'ok') ? event.reply("send_dirs", getDirs(arg['searchValue'])) : event.reply("search_alert", status) }
  // const data = getDirs(arg['searchValue'])

})

ipcMain.on('request_dirs', (event, arg) => {
  const parsedDirs = dirsJsonParse()
  event.reply("load_dirs", parsedDirs)
})

ipcMain.on('folder_clicked', (event, arg) => {
  const data2 = getFilesInDir(arg)
  event.reply("send_folder_dirs", data2)
})

ipcMain.on('download_request', (event, arg) => {
  download()
})

ipcMain.on('dir_dialog', (event, arg) => {
  // let progress = 0
  // let file_num = arg.length
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    event.reply("download_start", result.filePaths[0])
    arg.map(img => {
      fs.copyFile(img, path.join(result.filePaths[0], path.basename(img)), (err) => {
        if (err) throw err;
        event.reply("download_complete", "")
      });
    })

  })
})


// // 하나씩 전송되게 하려면 이렇게 해야하는데, 그러면 다운받는동안 다른 일을 못함..
// ipcMain.on('dir_dialog', (event, arg) => {
//   let progress = 0
//   let file_num = arg.length
//   dialog.showOpenDialog({
//     properties: ['openDirectory']
//   }).then(result => {
//     arg.map(img => {
//       progress++
//       fs.copyFileSync(img, path.join(result.filePaths[0], path.basename(img)))
//       event.reply("download_progress", Math.ceil(progress / file_num * 100))
//     })

//   })
// })