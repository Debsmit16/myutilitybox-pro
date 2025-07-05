# 🚀 MyUtilityBox Pro

A comprehensive, modern utility application built with React that combines multiple productivity tools in one sleek interface. Perfect for daily tasks, time management, calculations, and more!

![MyUtilityBox Pro](https://img.shields.io/badge/React-19.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black.svg)

## ✨ Features

### 📝 **Todo List**
- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- Persistent storage using localStorage
- Clean, intuitive interface

### 📝 **NotePad**
- Rich text note-taking
- Auto-save functionality
- Multiple notes support
- Search and organize notes

### 🔢 **Calculator**
- Basic arithmetic operations
- Scientific calculator functions
- Memory operations
- Keyboard support

### 🌤️ **Weather Widget**
- Real-time weather information
- Location-based forecasts
- Multiple city support
- Weather icons and animations

### ⏰ **Pomodoro Timer**
- Customizable work/break intervals
- Audio notifications
- Session tracking
- Productivity statistics

### 🎨 **Theme System**
- Multiple color themes
- Customizable accent colors
- Dark/Light mode support
- Responsive design

### 🕐 **Live Clock**
- Real-time clock display
- Multiple timezone support
- Elegant design integration

## 🚀 Live Demo

Visit the live application: [MyUtilityBox Pro](https://myutilitybox-pro.vercel.app)

## 🛠️ Technologies Used

- **Frontend**: React 19.1.0
- **Styling**: CSS3 with custom properties
- **Build Tool**: Create React App
- **Deployment**: Vercel
- **Testing**: React Testing Library, Jest
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Debsmit16/myutilitybox-pro.git
   cd myutilitybox-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy directly from GitHub**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy on every push to main branch

3. **Manual deployment**
   ```bash
   vercel --prod
   ```

### Deploy to Other Platforms

The application can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 📁 Project Structure

```
myutilitybox-pro/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Calculator.js
│   │   ├── Clock.js
│   │   ├── NotePad.js
│   │   ├── PomodoroTimer.js
│   │   ├── ThemeSwitcher.js
│   │   ├── TodoList.js
│   │   ├── WeatherWidget.js
│   │   └── [component].css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎨 Customization

### Adding New Themes
1. Edit `src/App.css` to add new CSS custom properties
2. Update the theme switcher component
3. Add theme options to the ThemeSwitcher component

### Adding New Utilities
1. Create a new component in `src/components/`
2. Add the component to `src/App.js`
3. Update the navigation tabs array
4. Style your component with CSS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Debsmit Saha**
- GitHub: [@Debsmit16](https://github.com/Debsmit16)
- Project Link: [https://github.com/Debsmit16/myutilitybox-pro](https://github.com/Debsmit16/myutilitybox-pro)

## 🙏 Acknowledgments

- React team for the amazing framework
- Create React App for the build tooling
- Vercel for seamless deployment
- All contributors and users of this project

---

⭐ **Star this repository if you find it helpful!**
