const { app, BrowserWindow, ipcMain, Menu } = require('electron');
Menu.setApplicationMenu(null); // remove a barra File Edit View Window Help
const caminho = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let janelaprincipal;
let portaSerial = null;
let leitor = null;

function criarJanela() {
  janelaprincipal = new BrowserWindow({
    width: 1200,
    height: 740,
    minWidth: 860,
    minHeight: 600,
    backgroundColor: '#06080f',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: caminho.join(__dirname, 'preload.js')
    },
    title: 'FIREGUARD'
  });

  janelaprincipal.loadFile(caminho.join(__dirname, 'index.html'));
  janelaprincipal.maximize();
}

ipcMain.handle('listar-portas', async () => {
  try { return await SerialPort.list(); }
  catch { return []; }
});

ipcMain.handle('conectar-porta', async (evento, caminhoPorta) => {
  try {
    if (portaSerial && portaSerial.isOpen) portaSerial.close();

    portaSerial = new SerialPort({ path: caminhoPorta, baudRate: 9600, autoOpen: false });
    leitor = portaSerial.pipe(new ReadlineParser({ delimiter: '\n' }));

    leitor.on('data', (linha) => {
      const aparado = linha.trim();
      // Formato: " ; Nivel: 342 | GAS MEDIO"
      const correspondencia = aparado.match(/Nivel:\s*(\d+)\s*\|\s*(.+)/i);
      if (correspondencia) {
        const valor  = parseInt(correspondencia[1]);
        const status = correspondencia[2].trim();
        janelaprincipal.webContents.send('dados-gas', { valor, status, bruto: aparado, momento: Date.now() });
      }
    });

    portaSerial.on('error', (erro) => janelaprincipal.webContents.send('erro-serial', erro.message));
    portaSerial.on('close', ()     => janelaprincipal.webContents.send('porta-fechada'));

    await new Promise((res, rej) => portaSerial.open(erro => erro ? rej(erro) : res()));
    return { sucesso: true };
  } catch (erro) {
    return { sucesso: false, erro: erro.message };
  }
});

ipcMain.handle('desconectar-porta', async () => {
  if (portaSerial && portaSerial.isOpen) portaSerial.close();
  return { sucesso: true };
});

app.whenReady().then(criarJanela);
app.on('window-all-closed', () => {
  if (portaSerial && portaSerial.isOpen) portaSerial.close();
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) criarJanela();
});