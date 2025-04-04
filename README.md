# AutoType: Ethical Writing Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)

AutoType is a free, open-source application designed to assist students with their academic work. The software provides a suite of tools for human-like auto typing, AI text humanization, tone adjustment, and plagiarism checking.

## Features

### Auto-Typing Engine
- Simulates human typing patterns with variable speed (40-250 WPM)
- Natural pauses after punctuation
- Random hesitations between words
- Occasional typos with backspace correction (configurable)
- Hand position simulation (faster typing for home row keys)

### Advanced Window Selection
- Pre-selection of target windows before typing begins
- Visual selection interface showing available windows
- Preview of selected window to confirm target
- Ability to change target window mid-session

### Text Humanization
- Breaks up lengthy sentences into more natural structures
- Varies sentence beginnings and transitions
- Adjusts formality levels and vocabulary complexity
- Introduces slight grammatical variations that appear natural
- Incorporates filler words and natural language markers

### Tone Adjustment
- Multiple tone presets:
  - Academic/Formal
  - Casual/Conversational
  - Professional/Business
  - Technical/Scientific
  - Creative/Narrative
- Custom tone creation through parameter adjustment
- Preservation of key content while modifying presentation style

### Plagiarism Detection
- Compares text against publicly available sources
- Highlights potentially problematic passages
- Offers rewriting suggestions
- Provides similarity percentage metrics
- Generates reports for self-assessment

## Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- npm or yarn

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/username/autotype.git
   cd autotype
   ```

2. Install JavaScript dependencies:
   ```
   npm install
   cd electron
   npm install
   cd ..
   ```

3. Install Python dependencies:
   ```
   pip install -r python/requirements.txt
   ```

4. Run the application:
   ```
   npm start
   ```

## Development

### Project Structure
```
autotype/
├── electron/                  # Electron.js frontend
│   ├── main.js                # Main electron process
│   ├── preload.js             # Preload script for IPC
│   ├── renderer/              # Renderer process files
│   │   ├── components/        # UI components
│   │   ├── styles/            # CSS files
│   │   └── views/             # Page layouts
│   └── package.json           # Electron dependencies
├── python/                    # Python backend
│   ├── autotyper/             # Auto-typing module
│   ├── humanizer/             # Text humanization module
│   ├── tone/                  # Tone adjustment module
│   ├── plagiarism/            # Plagiarism detection module
│   ├── api.py                 # API endpoints
│   └── requirements.txt       # Python dependencies
├── node/                      # Node.js integration layer
│   ├── bridge.js              # Bridge between Electron and Python
│   └── api.js                 # API handlers
├── config/                    # Configuration files
├── resources/                 # Static resources
├── LICENSE
└── README.md
```

### Building the Application

To build the application for different platforms:

```
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

The built applications will be available in the `dist` directory.

## Ethical Use Statement

AutoType is designed to assist students with their academic work, not to facilitate academic dishonesty. The application should be used responsibly to:

- Learn better writing techniques
- Improve efficiency in legitimate work
- Understand plagiarism risks in academic writing
- Develop a more natural writing style

Please use this tool ethically and in accordance with your institution's academic integrity policies.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
