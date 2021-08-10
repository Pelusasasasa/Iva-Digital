const {app, BrowserWindow} = require('electron');
const path = require('path')





function crearVentanaPrincipal() {
    let VentanaPrincipal = new BrowserWindow({
        width: 500,
        height: 300,
        icon: __dirname +'p.ico',
        webPreferences:{
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.js'),
        }
        
    });

    VentanaPrincipal.loadFile('index.html');

    VentanaPrincipal.on('closed',() => {
        app.quit();
    })
} 

app.whenReady().then(crearVentanaPrincipal);


