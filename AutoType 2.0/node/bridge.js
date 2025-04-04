/**
 * Bridge between Electron and Python backend
 * This module handles communication between the Electron UI and the Python processing modules
 */

const { PythonShell } = require('python-shell');
const path = require('path');
const { ipcMain } = require('electron');
const os = require('os');

// Get the root directory of the application
const rootDir = path.join(__dirname, '..');

// Configure Python path based on the operating system
const pythonPath = getPythonPath();

/**
 * Get the appropriate Python path based on the operating system
 */
function getPythonPath() {
  // Default to 'python' for most systems
  let pythonCommand = 'python';
  
  // On Windows, try 'python' first, then 'py'
  if (os.platform() === 'win32') {
    pythonCommand = 'python';
  } 
  // On macOS and Linux, try 'python3' first, then 'python'
  else if (os.platform() === 'darwin' || os.platform() === 'linux') {
    pythonCommand = 'python3';
  }
  
  return pythonCommand;
}

/**
 * Initialize the bridge to the Python backend
 */
function initBridge() {
  // Register IPC handlers for auto-typing feature
  registerAutoTyperHandlers();
  
  // Register IPC handlers for text humanization
  registerHumanizerHandlers();
  
  // Register IPC handlers for tone adjustment
  registerToneAdjusterHandlers();
  
  // Register IPC handlers for plagiarism detection
  registerPlagiarismHandlers();
  
  // Register handlers for window selection
  registerWindowSelectionHandlers();
  
  console.log('Python bridge initialized');
}

/**
 * Run a Python script with the given arguments and return its output
 * @param {string} scriptName - Name of the script to run (without .py extension)
 * @param {Array} args - Arguments to pass to the script
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise} Promise that resolves with the script output
 */
function runPythonScript(scriptName, args = [], progressCallback = null) {
  return new Promise((resolve, reject) => {
    // Options for PythonShell
    const options = {
      mode: 'json',
      pythonPath: pythonPath,
      scriptPath: path.join(rootDir, 'python'),
      args: args
    };
    
    // Run the Python script
    const pyshell = new PythonShell(`${scriptName}.py`, options);
    
    let results = [];
    
    // Handle messages from the Python script
    pyshell.on('message', (message) => {
      // If this is a progress update and a progress callback is provided
      if (message.type === 'progress' && progressCallback) {
        progressCallback(message);
      } 
      // Otherwise, collect the result
      else {
        results.push(message);
      }
    });
    
    // Handle errors
    pyshell.on('error', (err) => {
      console.error(`Error running Python script ${scriptName}:`, err);
      reject(err);
    });
    
    // Handle script end
    pyshell.on('close', () => {
      resolve(results);
    });
  });
}

/**
 * Register IPC handlers for the auto-typing feature
 */
function registerAutoTyperHandlers() {
  // Start typing handler
  ipcMain.handle('start-typing', async (event, text, options) => {
    try {
      // Get the window ID
      const windowId = options.windowId;
      
      // Get typing options
      const typingSpeed = options.speed || 120; // Default: 120 WPM
      const typoRate = options.typoRate || 0; // Default: 0%
      const pauseAfterComma = options.pauseAfterComma || 500; // Default: 500ms
      const pauseAfterPeriod = options.pauseAfterPeriod || 1000; // Default: 1000ms
      const randomHesitation = options.randomHesitation || 500; // Default: 500ms
      
      // Prepare arguments for the Python script
      const args = [
        '--text', text,
        '--window_id', windowId,
        '--typing_speed', typingSpeed.toString(),
        '--typo_rate', typoRate.toString(),
        '--pause_after_comma', pauseAfterComma.toString(),
        '--pause_after_period', pauseAfterPeriod.toString(),
        '--random_hesitation', randomHesitation.toString()
      ];
      
      // Create progress callback
      const progressCallback = (message) => {
        if (message.type === 'progress') {
          event.sender.send('typing-progress', message.data);
        } else if (message.type === 'error') {
          event.sender.send('typing-error', message.data);
        }
      };
      
      // Run the Python script
      const result = await runPythonScript('api', ['auto_typer', ...args], progressCallback);
      
      return result;
    } catch (error) {
      console.error('Error starting typing:', error);
      event.sender.send('typing-error', error.message);
      throw error;
    }
  });
  
  // Stop typing handler
  ipcMain.handle('stop-typing', async (event) => {
    try {
      const result = await runPythonScript('api', ['stop_typing']);
      return result;
    } catch (error) {
      console.error('Error stopping typing:', error);
      throw error;
    }
  });
  
  // Pause typing handler
  ipcMain.handle('pause-typing', async (event) => {
    try {
      const result = await runPythonScript('api', ['pause_typing']);
      return result;
    } catch (error) {
      console.error('Error pausing typing:', error);
      throw error;
    }
  });
  
  // Resume typing handler
  ipcMain.handle('resume-typing', async (event) => {
    try {
      const result = await runPythonScript('api', ['resume_typing']);
      return result;
    } catch (error) {
      console.error('Error resuming typing:', error);
      throw error;
    }
  });
}

/**
 * Register IPC handlers for window selection
 */
function registerWindowSelectionHandlers() {
  // Get available windows handler
  ipcMain.handle('get-available-windows', async (event) => {
    try {
      const result = await runPythonScript('api', ['get_windows']);
      return result[0].data || [];
    } catch (error) {
      console.error('Error getting available windows:', error);
      throw error;
    }
  });
  
  // Select window handler
  ipcMain.handle('select-window', async (event, windowId) => {
    try {
      const result = await runPythonScript('api', ['select_window', '--window_id', windowId]);
      return result[0].data || {};
    } catch (error) {
      console.error('Error selecting window:', error);
      throw error;
    }
  });
}

/**
 * Register IPC handlers for text humanization
 */
function registerHumanizerHandlers() {
  // Humanize text handler
  ipcMain.handle('humanize-text', async (event, text, options) => {
    try {
      // Get humanization options
      const sentenceComplexity = options.sentenceComplexity || 3; // Default: medium
      const vocabularyLevel = options.vocabularyLevel || 3; // Default: medium
      const addFillerWords = options.addFillerWords ? 'true' : 'false'; // Default: false
      const varySentenceBeginnings = options.varySentenceBeginnings ? 'true' : 'false'; // Default: false
      
      // Prepare arguments for the Python script
      const args = [
        '--text', text,
        '--sentence_complexity', sentenceComplexity.toString(),
        '--vocabulary_level', vocabularyLevel.toString(),
        '--add_filler_words', addFillerWords,
        '--vary_sentence_beginnings', varySentenceBeginnings
      ];
      
      // Run the Python script
      const result = await runPythonScript('api', ['humanize_text', ...args]);
      
      // Send a completion event
      event.sender.send('humanization-complete', { success: true });
      
      // Return the humanized text
      return result[0].data.humanizedText || '';
    } catch (error) {
      console.error('Error humanizing text:', error);
      event.sender.send('humanization-complete', { success: false, error: error.message });
      throw error;
    }
  });
}

/**
 * Register IPC handlers for tone adjustment
 */
function registerToneAdjusterHandlers() {
  // Adjust tone handler
  ipcMain.handle('adjust-tone', async (event, text, toneOptions) => {
    try {
      // Get tone options
      const formalityLevel = toneOptions.formalityLevel || 3; // Default: medium
      const technicalLevel = toneOptions.technicalLevel || 3; // Default: medium
      const preset = toneOptions.preset || 'custom'; // Default: custom
      
      // Prepare arguments for the Python script
      const args = [
        '--text', text,
        '--formality_level', formalityLevel.toString(),
        '--technical_level', technicalLevel.toString(),
        '--preset', preset
      ];
      
      // Run the Python script
      const result = await runPythonScript('api', ['adjust_tone', ...args]);
      
      // Send a completion event
      event.sender.send('tone-adjustment-complete', { success: true });
      
      // Return the adjusted text
      return result[0].data.adjustedText || '';
    } catch (error) {
      console.error('Error adjusting tone:', error);
      event.sender.send('tone-adjustment-complete', { success: false, error: error.message });
      throw error;
    }
  });
  
  // Get tone presets handler
  ipcMain.handle('get-tone-presets', async (event) => {
    try {
      const result = await runPythonScript('api', ['get_tone_presets']);
      return result[0].data || [];
    } catch (error) {
      console.error('Error getting tone presets:', error);
      throw error;
    }
  });
}

/**
 * Register IPC handlers for plagiarism detection
 */
function registerPlagiarismHandlers() {
  // Check plagiarism handler
  ipcMain.handle('check-plagiarism', async (event, text) => {
    try {
      // Prepare arguments for the Python script
      const args = [
        '--text', text
      ];
      
      // Run the Python script
      const result = await runPythonScript('api', ['check_plagiarism', ...args]);
      
      // Send a completion event
      event.sender.send('plagiarism-results', { success: true });
      
      // Return the plagiarism check results
      return result[0].data || { similarityScore: 0, sources: [], highlightedText: '' };
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      event.sender.send('plagiarism-results', { success: false, error: error.message });
      throw error;
    }
  });
}

// Export the bridge functions
module.exports = {
  initBridge,
  runPythonScript
}; 