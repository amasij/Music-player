// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const electron=require('electron')
const FS = require('fs')
const path = require('path')
const walk = require('walk');
const Menu = electron.Menu
const ipc = electron.ipcMain
const dialog = electron.dialog
const remote=require('electron').remote

let walker;
DIRCONTENT=[];



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 760,
    webPreferences: {
      nodeIntegration: true
    },
    frame:false
    
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

 // mainWindow.setMenu(template)
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
let template = [{
label: 'Edit App',
submenu: [{
label: 'Toggle Dev Tools',
accelerator: 'Ctrl+Shift+I',
role: 'toggledevtools'
}, {
label: 'Reload',
accelerator: 'Ctrl+R',
role: 'reload'
}]
}]

function selectDir()
{
  dialog.showOpenDialog({
properties: ['openDirectory'],
defaultPath: 'C:\\music1\\'},
 function (files) {
if (files) walkDir(files);
})
}

ipc.on('opendir', function (event, arg) {
selectDir();
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready',function(){
  const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipc.on('test', function (event, arg) {

event.sender.send('test-res', arg)

})


ipc.on('show-result', function (event, arg) {

event.sender.send('show-result', arg)

})

ipc.on('quit',function(event,arg){
  app.quit()
  remote.getCurrentWindow.close()
})
function walkDir(dir) {
  DIRCONTENT=[]
   walker = walk.walk(dir[0],'');
  
  pref=['.mp3','.m4a'];
  var folders=[];
    walker.on("file", function (root, fileStats, next) {
    FS.readFile(fileStats.name, function () {
      // doStuff
      if(pref.includes(path.extname(fileStats.name)))
      {
        var name=fileStats.name;
        var pathto=root+'\\'+fileStats.name;
        var parentDir=root;
        if(getCurrentIndex(parentDir,folders)===false)
        {
          folders.push({'folderName':parentDir,'tracks':[]});

        }
        
        DIRCONTENT.push({'name':name,'path':pathto,'parentDir':parentDir});

       // if(root=="C:\\books\\electron\\player\\ex\\a")
         // console.log(fileStats.name+'-----'+root+'---- true');

   // else
     // console.log(fileStats.name+'-----'+root);
      }
     
      next();
    });
  });
  walker.on("errors", function (root, nodeStatsArray, next) {
    next();
  });
 
  walker.on("end", function () {

   folders=getFolders(folders);
   mainWindow.webContents.send('all-songs',folders )
  });

function getFolders(folders)
{
  var index;
  for(var i=0;i<DIRCONTENT.length;i++)
  {
    index=getCurrentIndex(DIRCONTENT[i].parentDir,folders)
    var name=DIRCONTENT[i].name;
    var pathto=DIRCONTENT[i].path;
    folders[index].tracks.push({'name':name,'path':pathto});
    
  }
  return folders;
}


function getCurrentIndex(file,folders)
{
  for(var i=0;i<folders.length;i++)
  { 
    if(equals(file,folders[i].folderName)) return i;
  }
  return false;
  
}

function equals(value1,value2)
{
  return (value1===value2) 
}
/*
  FS.readdir(dir[0], function(err, files){
if (err) {
console.log('readdir err:'+err)
return
}
result=[];

for(var i=0;i<files.length;i++)
{
 
  if(pref.includes(files[i].substr(files[i].length-3,3)) )
  
        result.push(dir[0]+'\\'+ files[i])

      
  


}

mainWindow.webContents.send('walkDir-res', result)
})
//
*/
}

