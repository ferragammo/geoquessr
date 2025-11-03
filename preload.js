const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  indexedDB: indexedDB 
});
