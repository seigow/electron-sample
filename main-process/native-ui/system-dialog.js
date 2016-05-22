const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const BrowserWindow = require('electron').BrowserWindow

ipc.on('open-file-dialog', function(event){
  /**
   * To use sheet-style dialog, pass the window as the first argument
   *
   * const window = BrowserWindow.fromWebContents(event.sender)
   * dialog.showOpenDialog(window, ... )
   */
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function(files){
    if(files) event.sender.send('selected-directory', files)
  })
})
