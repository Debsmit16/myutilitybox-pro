import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const features = [
    {
      icon: '📋',
      title: 'Productivity Tools',
      description: 'To-Do lists, Notes, Pomodoro Timer, and World Clock to boost your productivity',
      tools: ['To-Do List', 'Notes', 'Pomodoro Timer', 'World Clock']
    },
    {
      icon: '🔧',
      title: 'Essential Utilities',
      description: 'Calculator, Unit Converter, Password Generator, QR Codes, and Link Shortener',
      tools: ['Scientific Calculator', 'Unit Converter', 'Password Generator', 'QR Generator', 'Link Shortener']
    },
    {
      icon: '🎨',
      title: 'Design & Text Tools',
      description: 'Advanced color picker and comprehensive text manipulation utilities',
      tools: ['Color Picker', 'Text Tools', 'Case Converter', 'Word Counter']
    },
    {
      icon: '💰',
      title: 'Finance & Health',
      description: 'Calculate tips, split bills, and monitor your health with BMI calculator',
      tools: ['Tip Calculator', 'BMI Calculator', 'Bill Splitter']
    },
    {
      icon: '🌤️',
      title: 'Information Hub',
      description: 'Real-time weather information with location-based forecasts',
      tools: ['Weather Widget', 'Location Services', 'Weather Alerts']
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      description: 'Your data synced across all devices with real-time updates',
      tools: ['Auto Sync', 'Backup', 'Multi-Device', 'Real-time Updates']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      content: 'MyUtilityBox Pro has replaced 10+ apps on my phone. Everything I need in one place!',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Developer',
      content: 'The scientific calculator and text tools are incredibly powerful. Love the clean interface!',
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Davis',
      role: 'Student',
      content: 'Perfect for studying! The Pomodoro timer and notes sync across all my devices.',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="nav-brand">
            <span className="brand-icon">🚀</span>
            <span className="brand-name">MyUtilityBox Pro</span>
          </div>
          <div className="nav-links">
            <Link to="/signin" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-link nav-link-primary">Get Started</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            All Your Daily Tools in <span className="highlight">One Place</span>
          </h1>
          <p className="hero-description">
            MyUtilityBox Pro combines 15+ essential productivity tools in a beautiful, 
            responsive interface. Boost your productivity with cloud sync across all devices.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">
              Start Free Today
            </Link>
            <Link to="/demo" className="btn btn-secondary btn-large">
              Try Demo
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Tools</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Responsive</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Cloud Sync</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-icons">
            <div className="hero-icon">📝</div>
            <div className="hero-icon">🔢</div>
            <div className="hero-icon">⏰</div>
            <div className="hero-icon">🌤️</div>
            <div className="hero-icon">🎨</div>
            <div className="hero-icon">🔐</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Everything You Need, Beautifully Organized</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-tools">
                  {feature.tools.map((tool, toolIndex) => (
                    <li key={toolIndex}>{tool}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Loved by Thousands of Users</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <span className="author-avatar">{testimonial.avatar}</span>
                  <div className="author-info">
                    <span className="author-name">{testimonial.name}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Boost Your Productivity?</h2>
          <p className="cta-description">
            Join thousands of users who have streamlined their daily tasks with MyUtilityBox Pro
          </p>
          <Link to="/signup" className="btn btn-primary btn-large">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-icon">🚀</span>
              <span className="brand-name">MyUtilityBox Pro</span>
            </div>
            <div className="footer-links">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#support">Support</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 MyUtilityBox Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
