import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrType, setQrType] = useState('text');
  const [qrOptions, setQrOptions] = useState({
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 256
  });
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  // Form data for different QR types
  const [formData, setFormData] = useState({
    url: '',
    text: '',
    email: { address: '', subject: '', body: '' },
    phone: '',
    sms: { number: '', message: '' },
    wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
    contact: { name: '', phone: '', email: '', organization: '' }
  });

  const qrTypes = {
    text: { name: '📝 Text', icon: '📝' },
    url: { name: '🔗 URL', icon: '🔗' },
    email: { name: '📧 Email', icon: '📧' },
    phone: { name: '📞 Phone', icon: '📞' },
    sms: { name: '💬 SMS', icon: '💬' },
    wifi: { name: '📶 WiFi', icon: '📶' },
    contact: { name: '👤 Contact', icon: '👤' }
  };

  useEffect(() => {
    if (inputText) {
      generateQRCode();
    } else {
      setQrCodeUrl('');
    }
  }, [inputText, qrOptions]);

  useEffect(() => {
    updateInputText();
  }, [qrType, formData]);

  const updateInputText = () => {
    let text = '';
    
    switch (qrType) {
      case 'text':
        text = formData.text;
        break;
      case 'url':
        text = formData.url;
        break;
      case 'email':
        text = `mailto:${formData.email.address}?subject=${encodeURIComponent(formData.email.subject)}&body=${encodeURIComponent(formData.email.body)}`;
        break;
      case 'phone':
        text = `tel:${formData.phone}`;
        break;
      case 'sms':
        text = `sms:${formData.sms.number}?body=${encodeURIComponent(formData.sms.message)}`;
        break;
      case 'wifi':
        text = `WIFI:T:${formData.wifi.security};S:${formData.wifi.ssid};P:${formData.wifi.password};H:${formData.wifi.hidden ? 'true' : 'false'};;`;
        break;
      case 'contact':
        text = `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.contact.name}\nTEL:${formData.contact.phone}\nEMAIL:${formData.contact.email}\nORG:${formData.contact.organization}\nEND:VCARD`;
        break;
      default:
        text = formData.text;
    }
    
    setInputText(text);
  };

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      await QRCode.toCanvas(canvas, inputText, qrOptions);
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL();
      setQrCodeUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to history
      const historyItem = {
        id: Date.now(),
        type: qrType,
        content: inputText.substring(0, 50) + (inputText.length > 50 ? '...' : ''),
        dataUrl: qrCodeUrl,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    }
  };

  const copyToClipboard = async () => {
    if (qrCodeUrl) {
      try {
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          } catch (clipboardError) {
            // Fallback: copy the data URL as text
            await navigator.clipboard.writeText(qrCodeUrl);
          }
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const renderForm = () => {
    switch (qrType) {
      case 'text':
        return (
          <div className="form-group">
            <label>Text Content</label>
            <textarea
              value={formData.text}
              onChange={(e) => updateFormData('text', e.target.value)}
              placeholder="Enter any text..."
              rows="4"
              className="form-textarea"
            />
          </div>
        );

      case 'url':
        return (
          <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => updateFormData('url', e.target.value)}
              placeholder="https://example.com"
              className="form-input"
            />
          </div>
        );

      case 'email':
        return (
          <div className="form-grid">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email.address}
                onChange={(e) => updateNestedFormData('email', 'address', e.target.value)}
                placeholder="user@example.com"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={formData.email.subject}
                onChange={(e) => updateNestedFormData('email', 'subject', e.target.value)}
                placeholder="Email subject"
                className="form-input"
              />
            </div>
            <div className="form-group full-width">
              <label>Message</label>
              <textarea
                value={formData.email.body}
                onChange={(e) => updateNestedFormData('email', 'body', e.target.value)}
                placeholder="Email message..."
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              placeholder="+1234567890"
              className="form-input"
            />
          </div>
        );

      case 'sms':
        return (
          <div className="form-grid">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.sms.number}
                onChange={(e) => updateNestedFormData('sms', 'number', e.target.value)}
                placeholder="+1234567890"
                className="form-input"
              />
            </div>
            <div className="form-group full-width">
              <label>Message</label>
              <textarea
                value={formData.sms.message}
                onChange={(e) => updateNestedFormData('sms', 'message', e.target.value)}
                placeholder="SMS message..."
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="form-grid">
            <div className="form-group">
              <label>Network Name (SSID)</label>
              <input
                type="text"
                value={formData.wifi.ssid}
                onChange={(e) => updateNestedFormData('wifi', 'ssid', e.target.value)}
                placeholder="WiFi Network Name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.wifi.password}
                onChange={(e) => updateNestedFormData('wifi', 'password', e.target.value)}
                placeholder="WiFi Password"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Security Type</label>
              <select
                value={formData.wifi.security}
                onChange={(e) => updateNestedFormData('wifi', 'security', e.target.value)}
                className="form-select"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open</option>
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.wifi.hidden}
                  onChange={(e) => updateNestedFormData('wifi', 'hidden', e.target.checked)}
                />
                Hidden Network
              </label>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.contact.name}
                onChange={(e) => updateNestedFormData('contact', 'name', e.target.value)}
                placeholder="John Doe"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => updateNestedFormData('contact', 'phone', e.target.value)}
                placeholder="+1234567890"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => updateNestedFormData('contact', 'email', e.target.value)}
                placeholder="john@example.com"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Organization</label>
              <input
                type="text"
                value={formData.contact.organization}
                onChange={(e) => updateNestedFormData('contact', 'organization', e.target.value)}
                placeholder="Company Name"
                className="form-input"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="qr-generator">
      {/* Header */}
      <div className="qr-header">
        <div className="header-left">
          <h2>📱 QR Code Generator</h2>
          <span className="qr-type-badge">{qrTypes[qrType].name}</span>
        </div>
        <div className="header-actions">
          {qrCodeUrl && (
            <>
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copy
              </button>
              <button onClick={downloadQRCode} className="download-btn">
                💾 Download
              </button>
            </>
          )}
        </div>
      </div>

      <div className="qr-content">
        {/* Type Selection */}
        <div className="type-selection">
          <h4>QR Code Type</h4>
          <div className="type-grid">
            {Object.entries(qrTypes).map(([key, type]) => (
              <button
                key={key}
                onClick={() => setQrType(key)}
                className={`type-btn ${qrType === key ? 'active' : ''}`}
              >
                <span className="type-icon">{type.icon}</span>
                <span className="type-name">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="qr-main">
          {/* Form Section */}
          <div className="form-section">
            <h4>Content</h4>
            {renderForm()}
          </div>

          {/* QR Code Display */}
          <div className="qr-display">
            <h4>QR Code</h4>
            <div className="qr-container">
              <canvas
                ref={canvasRef}
                className="qr-canvas"
                style={{ display: qrCodeUrl ? 'block' : 'none' }}
              />
              {!qrCodeUrl && (
                <div className="qr-placeholder">
                  <span className="placeholder-icon">📱</span>
                  <span className="placeholder-text">QR Code will appear here</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="options-section">
          <h4>Customization</h4>
          <div className="options-grid">
            <div className="option-group">
              <label>Size</label>
              <select
                value={qrOptions.width}
                onChange={(e) => setQrOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="option-select"
              >
                <option value="128">Small (128px)</option>
                <option value="256">Medium (256px)</option>
                <option value="512">Large (512px)</option>
                <option value="1024">Extra Large (1024px)</option>
              </select>
            </div>
            <div className="option-group">
              <label>Error Correction</label>
              <select
                value={qrOptions.errorCorrectionLevel}
                onChange={(e) => setQrOptions(prev => ({ ...prev, errorCorrectionLevel: e.target.value }))}
                className="option-select"
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
            <div className="option-group">
              <label>Foreground Color</label>
              <input
                type="color"
                value={qrOptions.color.dark}
                onChange={(e) => setQrOptions(prev => ({ 
                  ...prev, 
                  color: { ...prev.color, dark: e.target.value }
                }))}
                className="color-input"
              />
            </div>
            <div className="option-group">
              <label>Background Color</label>
              <input
                type="color"
                value={qrOptions.color.light}
                onChange={(e) => setQrOptions(prev => ({ 
                  ...prev, 
                  color: { ...prev.color, light: e.target.value }
                }))}
                className="color-input"
              />
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h4>Recent QR Codes</h4>
              <button onClick={clearHistory} className="clear-history-btn">
                Clear History
              </button>
            </div>
            <div className="history-grid">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <img src={item.dataUrl} alt="QR Code" className="history-qr" />
                  <div className="history-info">
                    <div className="history-type">{qrTypes[item.type].name}</div>
                    <div className="history-content">{item.content}</div>
                    <div className="history-time">{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
