const electron = require('electron');
const remote = electron.remote
const BrowserWindow = remote.BrowserWindow;
const path = require('path');
const dialog = remote.dialog
const Menu = remote.Menu
const MenuItem = remote.MenuItem
const shell = electron.shell
const os = require('os')
const ipc = electron.ipcRenderer

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
  const modalPath = path.join('file://', __dirname, 'subwindow.html');
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
  const modalPath = path.join('file://', __dirname, 'subwindow.html');
  console.log(modalPath)
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

// Open a file or directory
const selectDirBtn = document.getElementById('select-directory')

selectDirBtn.addEventListener('click', function(event){
  ipc.send('open-file-dialog')
})

ipc.on('selected-directory', function(event, path){
  document.getElementById('selected-file').innerHTML = `You selected: ${path}`
})

// Error dialog
const errorBtn = document.getElementById('error-dialog')
errorBtn.addEventListener('click', function(event){
  ipc.send('open-error-dialog')
})

// Information dialog
const informationBtn = document.getElementById('information-dialog')

informationBtn.addEventListener('click', function(event){
  ipc.send('open-information-dialog')
})

ipc.on('information-dialog-selection', function(event, index){
  let message = 'You selected ';
  if (index === 0) message += 'yes.';
  else message += 'no.';
  document.getElementById('info-selection').innerHTML = message
})

// Save dialog
const saveBtn = document.getElementById('save-dialog')

saveBtn.addEventListener('click', function(event){
  ipc.send('save-dialog')
})

ipc.on('saved-file', function(event, path){
  if(!path) path = 'No path'
  document.getElementById('file-saved').innerHTML = `Path selected: ${path}`
})

// Put app in the tray
const trayBtn = document.getElementById('put-in-tray')
let trayOn = false

trayBtn.addEventListener('click', function(event){
  if(trayOn){
    trayOn = false;
    document.getElementById('tray-countdown').innerHTML = '';
    ipc.send('remove-tray')
  } else{
    trayOn = true;
    const message = 'Click button again to remove';
    document.getElementById('tray-countdown').innerHTML = message;
    ipc.send('put-in-tray')
  }
})

// Tray removed from context menu
ipc.on('tray-remoded', function(){
  trayOn = false;
  document.getElementById('tray-countdown').innerHTML = ''
})

// Asynchronous messages
const asyncMsgBtn = document.getElementById('async-msg')
asyncMsgBtn.addEventListener('click', function(){
  ipc.send('asynchronous-message', 'ping')
})

ipc.on('asynchronous-reply', function(event, arg){
  const message = `Asynchronous message reply: ${arg}`;
  document.getElementById('async-reply').innerHTML = message
})

// Synchronous messages
const syncMsgBtn = document.getElementById('sync-msg')
syncMsgBtn.addEventListener('click', function(){
  const reply = ipc.sendSync('synchronous-message', 'ping');
  const message = `Synchronous message reply: ${reply}`
  document.getElementById('sync-reply').innerHTML = message
})

// Communicate with a invisible window
const invisMsgBtn = document.getElementById('invis-msg')
const invisReply = document.getElementById('invis-reply')

invisMsgBtn.addEventListener('click', function (clickEvent) {
  const windowID = BrowserWindow.getFocusedWindow().id
  const invisPath = path.join('file://', __dirname, 'invisible.html');
  let win = new BrowserWindow({ width: 400, height: 400, show: false })
  win.loadURL(invisPath)

  win.webContents.on('did-finish-load', function () {
    const input = 100
    win.webContents.send('compute-factorial', input, windowID)
  })
})

ipc.on('factorial-computed', function (event, input, output) {
  const message = `The factorial of ${input} is ${output}`
  invisReply.textContent = message
})
