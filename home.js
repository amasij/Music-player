const ipc = require('electron').ipcRenderer
ipc.send('test',['mp3','m4a'])
ipc.on('test-res', function (event, arg) {alert(arg);})