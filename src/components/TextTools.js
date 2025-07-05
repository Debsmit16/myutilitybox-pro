import React, { useState, useEffect } from 'react';
import './TextTools.css';

const TextTools = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedTool, setSelectedTool] = useState('analyze');
  const [textStats, setTextStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0
  });

  const tools = {
    analyze: { name: '📊 Text Analysis', icon: '📊' },
    uppercase: { name: '🔤 UPPERCASE', icon: '🔤' },
    lowercase: { name: '🔡 lowercase', icon: '🔡' },
    capitalize: { name: '🔠 Capitalize Words', icon: '🔠' },
    sentence: { name: '📝 Sentence case', icon: '📝' },
    reverse: { name: '🔄 Reverse Text', icon: '🔄' },
    removeSpaces: { name: '🚫 Remove Spaces', icon: '🚫' },
    removeLines: { name: '📄 Remove Empty Lines', icon: '📄' },
    addNumbers: { name: '🔢 Add Line Numbers', icon: '🔢' },
    sortLines: { name: '📋 Sort Lines', icon: '📋' },
    removeDuplicates: { name: '🗑️ Remove Duplicates', icon: '🗑️' },
    wordWrap: { name: '📏 Word Wrap', icon: '📏' }
  };

  useEffect(() => {
    calculateStats(inputText);
    processText(inputText, selectedTool);
  }, [inputText, selectedTool]);

  const calculateStats = (text) => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute

    setTextStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime
    });
  };

  const processText = (text, tool) => {
    let result = text;

    switch (tool) {
      case 'analyze':
        result = text; // Keep original for analysis
        break;
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'capitalize':
        result = text.replace(/\b\w/g, char => char.toUpperCase());
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\w|\.\s+\w)/g, char => char.toUpperCase());
        break;
      case 'reverse':
        result = text.split('').reverse().join('');
        break;
      case 'removeSpaces':
        result = text.replace(/\s+/g, '');
        break;
      case 'removeLines':
        result = text.replace(/^\s*\n/gm, '');
        break;
      case 'addNumbers':
        result = text.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
        break;
      case 'sortLines':
        result = text.split('\n').sort().join('\n');
        break;
      case 'removeDuplicates':
        const lines = text.split('\n');
        const uniqueLines = [...new Set(lines)];
        result = uniqueLines.join('\n');
        break;
      case 'wordWrap':
        result = text.replace(/(.{80})/g, '$1\n');
        break;
      default:
        result = text;
    }

    setOutputText(result);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const clearText = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    setInputText(outputText);
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'processed-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getWordFrequency = (text) => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  return (
    <div className="text-tools">
      {/* Header */}
      <div className="tools-header">
        <div className="header-left">
          <h2>📝 Text Tools</h2>
          <span className="tool-name">{tools[selectedTool].name}</span>
        </div>
        <div className="header-actions">
          <button onClick={clearText} className="clear-btn">
            🗑️ Clear
          </button>
          <button onClick={swapTexts} className="swap-btn" disabled={!outputText}>
            ⇄ Swap
          </button>
        </div>
      </div>

      <div className="tools-content">
        {/* Tool Selection */}
        <div className="tool-selection">
          <h4>Select Tool</h4>
          <div className="tool-grid">
            {Object.entries(tools).map(([key, tool]) => (
              <button
                key={key}
                onClick={() => setSelectedTool(key)}
                className={`tool-btn ${selectedTool === key ? 'active' : ''}`}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-label">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Areas */}
        <div className="text-areas">
          <div className="text-section">
            <div className="section-header">
              <h4>Input Text</h4>
              <div className="text-actions">
                <button 
                  onClick={() => copyToClipboard(inputText)} 
                  className="action-btn"
                  disabled={!inputText}
                >
                  📋 Copy
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="text-input"
              rows="12"
            />
          </div>

          <div className="text-section">
            <div className="section-header">
              <h4>Output Text</h4>
              <div className="text-actions">
                <button 
                  onClick={() => copyToClipboard(outputText)} 
                  className="action-btn"
                  disabled={!outputText}
                >
                  📋 Copy
                </button>
                <button 
                  onClick={downloadText} 
                  className="action-btn"
                  disabled={!outputText}
                >
                  💾 Download
                </button>
              </div>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Processed text will appear here..."
              className="text-output"
              rows="12"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <h4>Text Statistics</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Characters</span>
              <span className="stat-value">{textStats.characters.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Characters (no spaces)</span>
              <span className="stat-value">{textStats.charactersNoSpaces.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Words</span>
              <span className="stat-value">{textStats.words.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sentences</span>
              <span className="stat-value">{textStats.sentences.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Paragraphs</span>
              <span className="stat-value">{textStats.paragraphs.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lines</span>
              <span className="stat-value">{textStats.lines.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reading Time</span>
              <span className="stat-value">{textStats.readingTime} min</span>
            </div>
          </div>
        </div>

        {/* Word Frequency (only show for analysis) */}
        {selectedTool === 'analyze' && inputText && (
          <div className="frequency-section">
            <h4>Most Common Words</h4>
            <div className="frequency-list">
              {getWordFrequency(inputText).map(([word, count], index) => (
                <div key={word} className="frequency-item">
                  <span className="frequency-rank">#{index + 1}</span>
                  <span className="frequency-word">{word}</span>
                  <span className="frequency-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextTools;
