// Main application JavaScript for AutoType

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  initApp();
});

/**
 * Initialize the application
 */
function initApp() {
  // Set application version
  setAppVersion();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize theme toggle
  initThemeToggle();
  
  // Initialize all features
  initAutoTyper();
  initHumanizer();
  initToneAdjuster();
  initPlagiarismChecker();
  initSettings();
}

/**
 * Set application version from Electron
 */
async function setAppVersion() {
  try {
    const version = await window.api.getAppVersion();
    document.getElementById('app-version').textContent = version;
  } catch (error) {
    console.error('Error getting app version:', error);
  }
}

/**
 * Initialize tab navigation
 */
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the view to show
      const viewId = button.getAttribute('data-view');
      
      // Hide all views
      document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
      });
      
      // Show the selected view
      document.getElementById(viewId).classList.add('active');
      
      // Update active nav button
      navButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
  });
}

/**
 * Initialize theme toggle
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const darkModeCheckbox = document.getElementById('dark-mode');
  
  // Check for saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (darkModeCheckbox) {
      darkModeCheckbox.checked = true;
    }
  }
  
  // Theme toggle button
  themeToggleBtn.addEventListener('click', () => {
    toggleTheme();
  });
  
  // Dark mode checkbox in settings
  if (darkModeCheckbox) {
    darkModeCheckbox.addEventListener('change', () => {
      if (darkModeCheckbox.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update checkbox in settings if visible
  const darkModeCheckbox = document.getElementById('dark-mode');
  if (darkModeCheckbox) {
    darkModeCheckbox.checked = newTheme === 'dark';
  }
}

/**
 * Initialize Auto Typer feature
 */
function initAutoTyper() {
  // Elements
  const startTypingBtn = document.getElementById('start-typing-btn');
  const pauseTypingBtn = document.getElementById('pause-typing-btn');
  const stopTypingBtn = document.getElementById('stop-typing-btn');
  const typingText = document.getElementById('typing-text');
  const pasteBtn = document.getElementById('paste-btn');
  const pastePlainBtn = document.getElementById('paste-plain-btn');
  const typingStatus = document.getElementById('typing-status');
  const windowList = document.getElementById('window-list');
  
  // Range sliders and their value displays
  const sliders = [
    { input: 'typing-speed', output: 'typing-speed-value' },
    { input: 'typo-rate', output: 'typo-rate-value' },
    { input: 'pause-after-comma', output: 'pause-after-comma-value' },
    { input: 'pause-after-period', output: 'pause-after-period-value' },
    { input: 'random-hesitation', output: 'random-hesitation-value' }
  ];
  
  // Set up sliders
  sliders.forEach(slider => {
    const inputElement = document.getElementById(slider.input);
    const outputElement = document.getElementById(slider.output);
    
    if (inputElement && outputElement) {
      // Set initial value
      outputElement.textContent = inputElement.value;
      
      // Add event listener for changes
      inputElement.addEventListener('input', () => {
        outputElement.textContent = inputElement.value;
      });
    }
  });
  
  // Paste buttons
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      typingText.value = text;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      typingStatus.textContent = 'Failed to paste from clipboard. Please try again.';
    }
  });
  
  pastePlainBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      typingText.value = text.replace(/\\r\\n/g, '\n').replace(/[\\u2018\\u2019]/g, "'").replace(/[\\u201C\\u201D]/g, '"');
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      typingStatus.textContent = 'Failed to paste from clipboard. Please try again.';
    }
  });
  
  // Load available windows for selection
  async function loadAvailableWindows() {
    try {
      const windows = await window.api.getAvailableWindows();
      windowList.innerHTML = '';
      
      if (windows.length === 0) {
        windowList.innerHTML = '<p>No windows found</p>';
        return;
      }
      
      windows.forEach(win => {
        const windowItem = document.createElement('div');
        windowItem.className = 'window-item';
        windowItem.setAttribute('data-window-id', win.id);
        windowItem.textContent = win.title;
        
        windowItem.addEventListener('click', () => {
          // Remove selected class from all items
          document.querySelectorAll('.window-item').forEach(item => {
            item.classList.remove('selected');
          });
          
          // Add selected class to this item
          windowItem.classList.add('selected');
          
          // Show window preview
          showWindowPreview(win.id);
          
          // Select the window
          window.api.selectWindow(win.id);
        });
        
        windowList.appendChild(windowItem);
      });
    } catch (error) {
      console.error('Failed to load available windows:', error);
      windowList.innerHTML = '<p>Error loading windows</p>';
    }
  }
  
  // Show preview of selected window
  async function showWindowPreview(windowId) {
    try {
      const windowPreview = document.getElementById('window-preview');
      windowPreview.innerHTML = 'Loading preview...';
      
      // This would typically show a screenshot or information about the window
      // For this prototype, we'll just display the window ID
      windowPreview.innerHTML = `<p>Selected window: ${windowId}</p>`;
    } catch (error) {
      console.error('Failed to show window preview:', error);
    }
  }
  
  // Load windows when the view becomes active
  document.querySelector('[data-view="auto-typer"]').addEventListener('click', () => {
    loadAvailableWindows();
  });
  
  // Start typing button
  startTypingBtn.addEventListener('click', async () => {
    try {
      // Check if text is entered
      if (!typingText.value.trim()) {
        typingStatus.textContent = 'Please enter some text to type.';
        return;
      }
      
      // Check if a window is selected
      const selectedWindow = document.querySelector('.window-item.selected');
      if (!selectedWindow) {
        typingStatus.textContent = 'Please select a target window.';
        return;
      }
      
      // Get typing options
      const options = {
        speed: parseInt(document.getElementById('typing-speed').value),
        typoRate: parseInt(document.getElementById('typo-rate').value),
        pauseAfterComma: parseInt(document.getElementById('pause-after-comma').value),
        pauseAfterPeriod: parseInt(document.getElementById('pause-after-period').value),
        randomHesitation: parseInt(document.getElementById('random-hesitation').value),
        windowId: selectedWindow.getAttribute('data-window-id')
      };
      
      // Start typing
      await window.api.startTyping(typingText.value, options);
      
      // Update UI
      startTypingBtn.disabled = true;
      pauseTypingBtn.disabled = false;
      stopTypingBtn.disabled = false;
      typingStatus.textContent = 'Typing in progress...';
    } catch (error) {
      console.error('Failed to start typing:', error);
      typingStatus.textContent = 'Failed to start typing. ' + error.message;
    }
  });
  
  // Pause typing button
  pauseTypingBtn.addEventListener('click', async () => {
    try {
      if (pauseTypingBtn.textContent === 'Pause') {
        await window.api.pauseTyping();
        pauseTypingBtn.textContent = 'Resume';
        typingStatus.textContent = 'Typing paused.';
      } else {
        await window.api.resumeTyping();
        pauseTypingBtn.textContent = 'Pause';
        typingStatus.textContent = 'Typing resumed...';
      }
    } catch (error) {
      console.error('Failed to pause/resume typing:', error);
      typingStatus.textContent = 'Failed to pause/resume typing. ' + error.message;
    }
  });
  
  // Stop typing button
  stopTypingBtn.addEventListener('click', async () => {
    try {
      await window.api.stopTyping();
      
      // Update UI
      startTypingBtn.disabled = false;
      pauseTypingBtn.disabled = true;
      stopTypingBtn.disabled = true;
      pauseTypingBtn.textContent = 'Pause';
      typingStatus.textContent = 'Typing stopped.';
    } catch (error) {
      console.error('Failed to stop typing:', error);
      typingStatus.textContent = 'Failed to stop typing. ' + error.message;
    }
  });
  
  // Listen for typing progress updates
  window.api.on('typing-progress', (progress) => {
    typingStatus.textContent = `Typing in progress: ${progress.percentComplete}% (${progress.charactersTyped}/${progress.totalCharacters})`;
    
    // If complete, reset buttons
    if (progress.percentComplete === 100) {
      startTypingBtn.disabled = false;
      pauseTypingBtn.disabled = true;
      stopTypingBtn.disabled = true;
      typingStatus.textContent = 'Typing complete.';
    }
  });
  
  // Listen for typing errors
  window.api.on('typing-error', (error) => {
    typingStatus.textContent = 'Error: ' + error;
    startTypingBtn.disabled = false;
    pauseTypingBtn.disabled = true;
    stopTypingBtn.disabled = true;
  });
}

/**
 * Initialize Text Humanizer feature
 */
function initHumanizer() {
  // Elements
  const originalText = document.getElementById('original-text');
  const humanizedText = document.getElementById('humanized-text');
  const humanizeBtn = document.getElementById('humanize-btn');
  const copyHumanizedBtn = document.getElementById('copy-humanized-btn');
  const pasteBtn = document.getElementById('humanizer-paste-btn');
  const pastePlainBtn = document.getElementById('humanizer-paste-plain-btn');
  
  // Range sliders and their value displays
  const sliders = [
    { input: 'sentence-complexity', output: 'sentence-complexity-value' },
    { input: 'vocabulary-level', output: 'vocabulary-level-value' }
  ];
  
  // Set up sliders
  sliders.forEach(slider => {
    const inputElement = document.getElementById(slider.input);
    const outputElement = document.getElementById(slider.output);
    
    if (inputElement && outputElement) {
      // Set initial value
      outputElement.textContent = inputElement.value;
      
      // Add event listener for changes
      inputElement.addEventListener('input', () => {
        outputElement.textContent = inputElement.value;
      });
    }
  });
  
  // Paste buttons
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      originalText.value = text;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  });
  
  pastePlainBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      originalText.value = text.replace(/\\r\\n/g, '\n').replace(/[\\u2018\\u2019]/g, "'").replace(/[\\u201C\\u201D]/g, '"');
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  });
  
  // Humanize button
  humanizeBtn.addEventListener('click', async () => {
    try {
      // Check if text is entered
      if (!originalText.value.trim()) {
        humanizedText.value = 'Please enter some text to humanize.';
        return;
      }
      
      // Show loading state
      humanizedText.value = 'Humanizing text...';
      humanizeBtn.disabled = true;
      
      // Get humanization options
      const options = {
        sentenceComplexity: parseInt(document.getElementById('sentence-complexity').value),
        vocabularyLevel: parseInt(document.getElementById('vocabulary-level').value),
        addFillerWords: document.getElementById('add-filler-words').checked,
        varySentenceBeginnings: document.getElementById('vary-sentence-beginnings').checked
      };
      
      // Call humanize API
      const result = await window.api.humanizeText(originalText.value, options);
      
      // Update UI with result
      humanizedText.value = result;
      humanizeBtn.disabled = false;
    } catch (error) {
      console.error('Failed to humanize text:', error);
      humanizedText.value = 'Failed to humanize text. ' + error.message;
      humanizeBtn.disabled = false;
    }
  });
  
  // Copy button
  copyHumanizedBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(humanizedText.value);
      // Visual feedback for copy
      const originalText = copyHumanizedBtn.textContent;
      copyHumanizedBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyHumanizedBtn.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  });
}

/**
 * Initialize Tone Adjuster feature
 */
function initToneAdjuster() {
  // Elements
  const originalText = document.getElementById('tone-original-text');
  const adjustedText = document.getElementById('tone-adjusted-text');
  const adjustToneBtn = document.getElementById('adjust-tone-btn');
  const copyAdjustedBtn = document.getElementById('copy-tone-adjusted-btn');
  const pasteBtn = document.getElementById('tone-paste-btn');
  const pastePlainBtn = document.getElementById('tone-paste-plain-btn');
  const tonePresetBtns = document.querySelectorAll('.tone-preset-btn');
  
  // Range sliders and their value displays
  const sliders = [
    { input: 'formality-level', output: 'formality-level-value' },
    { input: 'technical-level', output: 'technical-level-value' }
  ];
  
  // Set up sliders
  sliders.forEach(slider => {
    const inputElement = document.getElementById(slider.input);
    const outputElement = document.getElementById(slider.output);
    
    if (inputElement && outputElement) {
      // Set initial value
      outputElement.textContent = inputElement.value;
      
      // Add event listener for changes
      inputElement.addEventListener('input', () => {
        outputElement.textContent = inputElement.value;
      });
    }
  });
  
  // Paste buttons
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      originalText.value = text;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  });
  
  pastePlainBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      originalText.value = text.replace(/\\r\\n/g, '\n').replace(/[\\u2018\\u2019]/g, "'").replace(/[\\u201C\\u201D]/g, '"');
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  });
  
  // Tone preset buttons
  tonePresetBtns.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all preset buttons
      tonePresetBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Set slider values based on preset
      const preset = button.getAttribute('data-preset');
      switch (preset) {
        case 'academic':
          document.getElementById('formality-level').value = 5;
          document.getElementById('formality-level-value').textContent = 5;
          document.getElementById('technical-level').value = 4;
          document.getElementById('technical-level-value').textContent = 4;
          break;
        case 'casual':
          document.getElementById('formality-level').value = 1;
          document.getElementById('formality-level-value').textContent = 1;
          document.getElementById('technical-level').value = 2;
          document.getElementById('technical-level-value').textContent = 2;
          break;
        case 'professional':
          document.getElementById('formality-level').value = 4;
          document.getElementById('formality-level-value').textContent = 4;
          document.getElementById('technical-level').value = 3;
          document.getElementById('technical-level-value').textContent = 3;
          break;
        case 'technical':
          document.getElementById('formality-level').value = 3;
          document.getElementById('formality-level-value').textContent = 3;
          document.getElementById('technical-level').value = 5;
          document.getElementById('technical-level-value').textContent = 5;
          break;
        case 'creative':
          document.getElementById('formality-level').value = 2;
          document.getElementById('formality-level-value').textContent = 2;
          document.getElementById('technical-level').value = 1;
          document.getElementById('technical-level-value').textContent = 1;
          break;
      }
    });
  });
  
  // Adjust tone button
  adjustToneBtn.addEventListener('click', async () => {
    try {
      // Check if text is entered
      if (!originalText.value.trim()) {
        adjustedText.value = 'Please enter some text to adjust tone.';
        return;
      }
      
      // Show loading state
      adjustedText.value = 'Adjusting tone...';
      adjustToneBtn.disabled = true;
      
      // Get tone options
      const toneOptions = {
        formalityLevel: parseInt(document.getElementById('formality-level').value),
        technicalLevel: parseInt(document.getElementById('technical-level').value),
        preset: document.querySelector('.tone-preset-btn.active')?.getAttribute('data-preset') || 'custom'
      };
      
      // Call tone adjustment API
      const result = await window.api.adjustTone(originalText.value, toneOptions);
      
      // Update UI with result
      adjustedText.value = result;
      adjustToneBtn.disabled = false;
    } catch (error) {
      console.error('Failed to adjust tone:', error);
      adjustedText.value = 'Failed to adjust tone. ' + error.message;
      adjustToneBtn.disabled = false;
    }
  });
  
  // Copy button
  copyAdjustedBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(adjustedText.value);
      // Visual feedback for copy
      const originalText = copyAdjustedBtn.textContent;
      copyAdjustedBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyAdjustedBtn.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  });
}

/**
 * Initialize Plagiarism Checker feature
 */
function initPlagiarismChecker() {
  // Elements
  const plagiarismText = document.getElementById('plagiarism-text');
  const checkPlagiarismBtn = document.getElementById('check-plagiarism-btn');
  const pasteBtn = document.getElementById('plagiarism-paste-btn');
  const pastePlainBtn = document.getElementById('plagiarism-paste-plain-btn');
  const similarityValue = document.querySelector('.similarity-value');
  const similarityProgress = document.querySelector('.similarity-progress');
  const sourcesList = document.getElementById('sources-list');
  const highlightedText = document.getElementById('highlighted-text');
  
  // Paste buttons
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      plagiarismText.value = text;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  });
  
  pastePlainBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      plagiarismText.value = text.replace(/\\r\\n/g, '\n').replace(/[\\u2018\\u2019]/g, "'").replace(/[\\u201C\\u201D]/g, '"');
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  });
  
  // Check plagiarism button
  checkPlagiarismBtn.addEventListener('click', async () => {
    try {
      // Check if text is entered
      if (!plagiarismText.value.trim()) {
        highlightedText.innerHTML = '<p>Please enter some text to check for plagiarism.</p>';
        return;
      }
      
      // Show loading state
      similarityValue.textContent = '...';
      similarityProgress.style.width = '0%';
      sourcesList.innerHTML = '<p>Checking sources...</p>';
      highlightedText.innerHTML = '<p>Checking text...</p>';
      checkPlagiarismBtn.disabled = true;
      
      // Call plagiarism check API
      const result = await window.api.checkPlagiarism(plagiarismText.value);
      
      // Update UI with result
      updatePlagiarismResults(result);
      checkPlagiarismBtn.disabled = false;
    } catch (error) {
      console.error('Failed to check plagiarism:', error);
      similarityValue.textContent = 'Error';
      sourcesList.innerHTML = '<p>Error checking sources.</p>';
      highlightedText.innerHTML = '<p>Error checking plagiarism: ' + error.message + '</p>';
      checkPlagiarismBtn.disabled = false;
    }
  });
  
  // Update the plagiarism results in the UI
  function updatePlagiarismResults(result) {
    // Update similarity value and progress bar
    const similarityPercent = Math.round(result.similarityScore * 100);
    similarityValue.textContent = similarityPercent + '%';
    similarityProgress.style.width = similarityPercent + '%';
    
    // Update color based on similarity level
    if (similarityPercent < 20) {
      similarityProgress.style.backgroundColor = 'var(--secondary-color)';
    } else if (similarityPercent < 40) {
      similarityProgress.style.backgroundColor = 'orange';
    } else {
      similarityProgress.style.backgroundColor = 'var(--accent-color)';
    }
    
    // Update sources list
    if (result.sources.length === 0) {
      sourcesList.innerHTML = '<p>No sources found</p>';
    } else {
      sourcesList.innerHTML = '';
      result.sources.forEach(source => {
        const sourceItem = document.createElement('div');
        sourceItem.className = 'source-item';
        sourceItem.innerHTML = `
          <div class="source-url">${source.url}</div>
          <div class="source-similarity">${Math.round(source.similarity * 100)}% match</div>
        `;
        sourcesList.appendChild(sourceItem);
      });
    }
    
    // Update highlighted text
    if (result.highlightedText) {
      highlightedText.innerHTML = result.highlightedText;
    } else {
      // Fallback if no highlighted text is provided
      highlightedText.innerHTML = '<p>No plagiarism detected in the text.</p>';
    }
  }
}

/**
 * Initialize Settings
 */
function initSettings() {
  // Elements
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const resetSettingsBtn = document.getElementById('reset-settings-btn');
  const editHotkeyBtns = document.querySelectorAll('.edit-hotkey-btn');
  
  // Save settings button
  saveSettingsBtn.addEventListener('click', () => {
    // Get all settings
    const settings = {
      darkMode: document.getElementById('dark-mode').checked,
      autoSave: document.getElementById('auto-save').checked,
      hotkeys: {
        startTyping: document.getElementById('start-typing-hotkey').value,
        pauseTyping: document.getElementById('pause-typing-hotkey').value
      }
    };
    
    // Save settings to localStorage
    localStorage.setItem('autotype-settings', JSON.stringify(settings));
    
    // Visual feedback
    const originalText = saveSettingsBtn.textContent;
    saveSettingsBtn.textContent = 'Settings Saved!';
    setTimeout(() => {
      saveSettingsBtn.textContent = originalText;
    }, 2000);
  });
  
  // Reset settings button
  resetSettingsBtn.addEventListener('click', () => {
    // Default settings
    const defaultSettings = {
      darkMode: false,
      autoSave: true,
      hotkeys: {
        startTyping: 'CTRL+SHIFT+A',
        pauseTyping: 'CTRL+SHIFT+F'
      }
    };
    
    // Apply default settings to UI
    document.getElementById('dark-mode').checked = defaultSettings.darkMode;
    document.getElementById('auto-save').checked = defaultSettings.autoSave;
    document.getElementById('start-typing-hotkey').value = defaultSettings.hotkeys.startTyping;
    document.getElementById('pause-typing-hotkey').value = defaultSettings.hotkeys.pauseTyping;
    
    // Apply theme
    if (!defaultSettings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Save to localStorage
    localStorage.setItem('autotype-settings', JSON.stringify(defaultSettings));
    
    // Visual feedback
    const originalText = resetSettingsBtn.textContent;
    resetSettingsBtn.textContent = 'Settings Reset!';
    setTimeout(() => {
      resetSettingsBtn.textContent = originalText;
    }, 2000);
  });
  
  // Edit hotkey buttons
  editHotkeyBtns.forEach(button => {
    button.addEventListener('click', () => {
      const hotkeyInput = button.previousElementSibling;
      
      // Indicate recording state
      const originalText = button.textContent;
      button.textContent = 'Press Keys...';
      hotkeyInput.value = 'Recording...';
      
      // Function to handle key combinations
      const recordHotkey = (event) => {
        event.preventDefault();
        
        // Build hotkey string
        let hotkey = '';
        if (event.ctrlKey) hotkey += 'CTRL+';
        if (event.shiftKey) hotkey += 'SHIFT+';
        if (event.altKey) hotkey += 'ALT+';
        if (event.metaKey) hotkey += 'META+';
        
        // Add the key if it's not a modifier
        if (!'Control Shift Alt Meta'.includes(event.key)) {
          hotkey += event.key.toUpperCase();
        }
        
        // Only save if we have a valid hotkey
        if (hotkey && !hotkey.endsWith('+')) {
          hotkeyInput.value = hotkey;
          button.textContent = originalText;
          
          // Remove the event listeners
          document.removeEventListener('keydown', recordHotkey);
          document.removeEventListener('click', cancelRecording);
        }
      };
      
      // Function to cancel recording on click elsewhere
      const cancelRecording = (event) => {
        if (event.target !== button && event.target !== hotkeyInput) {
          button.textContent = originalText;
          
          // Restore previous value if cancelled
          if (hotkeyInput.value === 'Recording...') {
            hotkeyInput.value = hotkeyInput.getAttribute('data-previous-value') || '';
          }
          
          // Remove the event listeners
          document.removeEventListener('keydown', recordHotkey);
          document.removeEventListener('click', cancelRecording);
        }
      };
      
      // Store previous value
      hotkeyInput.setAttribute('data-previous-value', hotkeyInput.value);
      
      // Add event listeners
      document.addEventListener('keydown', recordHotkey);
      setTimeout(() => {
        document.addEventListener('click', cancelRecording);
      }, 10);
    });
  });
  
  // Load saved settings
  loadSettings();
}

/**
 * Load saved settings from localStorage
 */
function loadSettings() {
  const savedSettings = localStorage.getItem('autotype-settings');
  
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      
      // Apply saved settings to UI
      if (settings.darkMode !== undefined) {
        document.getElementById('dark-mode').checked = settings.darkMode;
      }
      
      if (settings.autoSave !== undefined) {
        document.getElementById('auto-save').checked = settings.autoSave;
      }
      
      if (settings.hotkeys) {
        if (settings.hotkeys.startTyping) {
          document.getElementById('start-typing-hotkey').value = settings.hotkeys.startTyping;
        }
        
        if (settings.hotkeys.pauseTyping) {
          document.getElementById('pause-typing-hotkey').value = settings.hotkeys.pauseTyping;
        }
      }
    } catch (error) {
      console.error('Failed to parse saved settings:', error);
    }
  }
} 