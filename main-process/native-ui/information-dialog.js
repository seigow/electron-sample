const ipc = require('electron').ipcMain
const dialog = require('electron').dialog


ipc.on('open-information-dialog', function(event, index){
  const options = {
    type:'info',
    title:'Information',
    message:"This is an information dialog. Isn't is nice?",
    buttons: ['Yes','No']
  }
  dialog.showMessageBox(options, function(index){
    event.sender.send('information-dialog-selection', index)
  })
})
