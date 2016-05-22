const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain

let appIcon = null

ipc.on('put-in-tray', function(event){
  // const iconPath = path.join(__dirname, 'pronama_icon-1.jpg');
  const iconPath = path.join(__dirname, 'iconTemplate.png');
  console.log(iconPath)
  appIcon = new electron.Tray(iconPath);
  const contextMenu = electron.Menu.buildFromTemplate([
    {label: 'Remove',
      click: function(menuItem, browserWindow){
        event.sender.send('tray-removed');
        appIcon.destroy()
      }
    }
  ]);
  appIcon.setToolTip('Electron Demo in the tray.');
  appIcon.setContextMenu(contextMenu)
})

ipc.on('remove-tray', function(event){
  appIcon.destroy()
})
