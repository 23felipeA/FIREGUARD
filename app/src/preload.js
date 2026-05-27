const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('arduino', {
  listarPortas:      () => ipcRenderer.invoke('listar-portas'),
  conectar:          (porta) => ipcRenderer.invoke('conectar-porta', porta),
  desconectar:       () => ipcRenderer.invoke('desconectar-porta'),
  aoReceberDados:    (cb) => ipcRenderer.on('dados-gas',    (_, dados) => cb(dados)),
  aoReceberErro:     (cb) => ipcRenderer.on('erro-serial',  (_, msg)   => cb(msg)),
  aoFechar:          (cb) => ipcRenderer.on('porta-fechada', ()        => cb()),
  removerListeners:  () => {
    ipcRenderer.removeAllListeners('dados-gas');
    ipcRenderer.removeAllListeners('erro-serial');
    ipcRenderer.removeAllListeners('porta-fechada');
  }
});
