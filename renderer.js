const electron = require('electron');
const remote = electron.remote
const BrowserWindow = remote.BrowserWindow;
const path = require('path');
const dialog = remote.dialog
const Menu = remote.Menu
const MenuItem = remote.MenuItem
const shell = electron.shell
const os = require('os')

let menu = new Menu();

menu.append(new MenuItem({ label: "Hello" }))
menu.append(new MenuItem({type:"separator"}))
menu.append(new MenuItem({ label: "Electron", type: "checkbox", checked: true}))

window.addEventListener("contextmenu", function(e){
  e.preventDefault();
  menu.popup(remote.getCurrentWindow())
}, false)

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

// open file mangager
const fileManagerBtn = document.getElementById('open-file-manager')

fileManagerBtn.addEventListener('click', function(event){
  shell.showItemInFolder(os.homedir())
})

// external links
const exLinksBtn = document.getElementById('open-ex-links');

exLinksBtn.addEventListener('click', function(){
  shell.openExternal('http://electron.atom.io')
})

// open all outbound links externally
const links = document.querySelectorAll("a[href]")
Array.prototype.forEach.call(links, function(link){
  const url = link.getAttribute('href');
  if(url.indexOf('http') === 0){
    link.addEventListener('click', function(e){
      e.preventDefault();
      shell.openExternal(url);
    })
  }
})
