# Contributing to MyUtilityBox Pro

Thank you for your interest in contributing to MyUtilityBox Pro! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm package manager
- Git

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/myutilitybox-pro.git
   cd myutilitybox-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🎯 How to Contribute

### Reporting Bugs
- Use the GitHub Issues tab
- Provide detailed description of the bug
- Include steps to reproduce
- Add screenshots if applicable

### Suggesting Features
- Open a GitHub Issue with the "enhancement" label
- Describe the feature and its benefits
- Discuss implementation approach

### Code Contributions

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add appropriate tests
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Code Style Guidelines

### React Components
- Use functional components with hooks
- Follow the existing file structure
- Include both .js and .css files for components
- Use descriptive component and variable names

### CSS
- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use the existing color scheme variables

### JavaScript
- Use ES6+ features
- Add proper error handling
- Include JSDoc comments for complex functions
- Follow the existing naming conventions

## 🧪 Testing

- Write tests for new features
- Ensure all existing tests pass
- Test on multiple browsers and devices
- Verify responsive design works correctly

## 📋 Pull Request Process

1. Ensure your code follows the style guidelines
2. Update the README.md if needed
3. Add tests for new functionality
4. Ensure all tests pass
5. Request review from maintainers

## 🎨 Adding New Utilities

When adding a new utility tool:

1. **Create component files**
   ```
   src/components/YourTool.js
   src/components/YourTool.css
   ```

2. **Update App.js**
   - Import your component
   - Add to toolCategories array
   - Add to renderActiveComponent switch

3. **Follow design patterns**
   - Use consistent styling
   - Implement theme support
   - Add local storage if needed
   - Ensure responsive design

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct

## 📞 Getting Help

- Open a GitHub Issue for questions
- Check existing issues and documentation
- Join discussions in pull requests

Thank you for contributing to MyUtilityBox Pro! 🚀
