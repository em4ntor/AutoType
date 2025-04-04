const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Auto-typing functionality
  startTyping: (text, options) => ipcRenderer.invoke('start-typing', text, options),
  stopTyping: () => ipcRenderer.invoke('stop-typing'),
  pauseTyping: () => ipcRenderer.invoke('pause-typing'),
  resumeTyping: () => ipcRenderer.invoke('resume-typing'),
  
  // Window selection
  getAvailableWindows: () => ipcRenderer.invoke('get-available-windows'),
  selectWindow: (windowId) => ipcRenderer.invoke('select-window', windowId),
  
  // Text humanization
  humanizeText: (text, options) => ipcRenderer.invoke('humanize-text', text, options),
  
  // Tone adjustment
  adjustTone: (text, toneOptions) => ipcRenderer.invoke('adjust-tone', text, toneOptions),
  getTonePresets: () => ipcRenderer.invoke('get-tone-presets'),
  
  // Plagiarism detection
  checkPlagiarism: (text) => ipcRenderer.invoke('check-plagiarism', text),
  
  // Event listeners
  on: (channel, callback) => {
    // Whitelist channels we want to allow
    const validChannels = [
      'typing-progress', 
      'typing-error', 
      'humanization-complete',
      'tone-adjustment-complete',
      'plagiarism-results'
    ];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender` 
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  
  // Remove event listeners
  removeListener: (channel, callback) => {
    const validChannels = [
      'typing-progress', 
      'typing-error', 
      'humanization-complete',
      'tone-adjustment-complete',
      'plagiarism-results'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    }
  }
}); 