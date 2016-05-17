const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const path = require('path');
const dialog = electron.remote.dialog

const newWindowBtn = document.getElementById('new-window');
newWindowBtn.addEventListener('click', function(event){
  const modalPath = path.join('file://', __dirname, '/subwindow.html');
  subWindow = new BrowserWindow({width: 400, height:320});

  subWindow.webContents.on('crashed', function(){
    const options = {
      type: 'info',
      title: 'Render Process Crashed',
      message: 'This process has crashed.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function(index){
      if(index==0) subWindow.reload()
      else subWindow.close()
    })
  })

  subWindow.webContents.on('unresponsive', function(){
    const options = {
      type: 'info',
      title: 'Render Process Hanging',
      message: 'This process is Hanging.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function(index){
      if(index==0) subWindow.reload()
      else subWindow.close()
    })
  })

  subWindow.on('resize', updateReply);
  subWindow.on('move', updateReply);
  subWindow.on('closed', function(){ subWindow=null });

  subWindow.loadURL(modalPath);
  subWindow.show()

  function updateReply(){
    const managedWindowReply = document.getElementById('manage-window-reply');
    const message = `Size: ${subWindow.getSize()} Position: ${subWindow.getPosition()}`;

    managedWindowReply.innerText = message;
  }

});


const newFramelessWindowBtn = document.getElementById('new-frameless-window');
newFramelessWindowBtn.addEventListener('click', function(event){
  const modalPath = path.join('file://', __dirname, '/subwindow.html');
  subWindow = new BrowserWindow({width: 400, height:320, frame:false});

  subWindow.webContents.on('crashed', function(){
    const options = {
      type: 'info',
      title: 'Render Process Crashed',
      message: 'This process has crashed.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function(index){
      if(index==0) subWindow.reload()
      else subWindow.close()
    })
  })

  subWindow.webContents.on('unresponsive', function(){
    const options = {
      type: 'info',
      title: 'Render Process Hanging',
      message: 'This process is Hanging.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function(index){
      if(index==0) subWindow.reload()
      else subWindow.close()
    })
  })

  subWindow.on('resize', updateReply);
  subWindow.on('move', updateReply);
  subWindow.on('closed', function(){ subWindow=null });

  subWindow.loadURL(modalPath);
  subWindow.show()

  function updateReply(){
    const managedWindowReply = document.getElementById('manage-window-reply');
    const message = `Size: ${subWindow.getSize()} Position: ${subWindow.getPosition()}`;

    managedWindowReply.innerText = message;
  }

});
