const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const path = require('path');

const newWindowBtn = document.getElementById('new-window');
newWindowBtn.addEventListener('click', function(event){
  const modalPath = path.join('file://', __dirname, '/subwindow.html');
  subWindow = new BrowserWindow({width: 400, height:320});

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
