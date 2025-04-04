/**
 * API for the AutoType application
 * This module initializes the Python bridge and connects it to the Electron main process
 */

const { initBridge } = require('./bridge');
const { app } = require('electron');

/**
 * Initialize the API
 * @param {BrowserWindow} mainWindow - The main Electron browser window
 */
function initAPI(mainWindow) {
  // Initialize the Python bridge
  initBridge();
  
  console.log('API initialized');
}

module.exports = { initAPI }; 