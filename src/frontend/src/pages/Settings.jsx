import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    sunriseOffsetMinutes: 0,
    sunsetOffsetMinutes: -20
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/images/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberChange = async (key, value) => {
    const numValue = parseInt(value, 10) || 0;
    const newSettings = { ...settings, [key]: numValue };
    setSettings(newSettings);
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/images/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved!' });
        setTimeout(() => setMessage(null), 2000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
      setSettings({ ...settings });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-container card">
        <div className="settings-section">
          <h2 className="section-title">Daylight Video Offsets</h2>
          <p className="section-description">
            Adjust sunrise and sunset times used for daylight video generation to compensate for camera low-light limitations. Values are in minutes (negative = earlier, positive = later).
          </p>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Sunrise Offset (minutes)</span>
              <span className="setting-description">
                Shift the sunrise time for daylight videos. E.g. +20 starts capturing 20 minutes after sunrise.
              </span>
            </div>
            <input
              type="number"
              className="setting-number-input"
              value={settings.sunriseOffsetMinutes}
              onChange={(e) => handleNumberChange('sunriseOffsetMinutes', e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Sunset Offset (minutes)</span>
              <span className="setting-description">
                Shift the sunset time for daylight videos. E.g. -20 stops capturing 20 minutes before sunset.
              </span>
            </div>
            <input
              type="number"
              className="setting-number-input"
              value={settings.sunsetOffsetMinutes}
              onChange={(e) => handleNumberChange('sunsetOffsetMinutes', e.target.value)}
              disabled={saving}
            />
          </div>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="settings-container card">
        <div className="settings-section">
          <h2 className="section-title">Admin</h2>
          <p className="section-description">
            Manage raw daily captures and generated daily videos.
          </p>
          <div className="admin-buttons">
            <button className="admin-button" onClick={() => navigate('/daily-images')}>
              <span className="admin-button-icon">{'\u25A6'}</span>
              Daily Images
            </button>
            <button className="admin-button" onClick={() => navigate('/daily-videos')}>
              <span className="admin-button-icon">{'\u25B6'}</span>
              Daily Videos
            </button>
            <button className="admin-button" onClick={() => navigate('/daylight-videos')}>
              <span className="admin-button-icon">{'\u2600'}</span>
              Daylight Videos
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Settings;
