# 🎮 SmashNet Calculator

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.2.26-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern web application for managing and calculating Smash Bros. tournament matches with an intelligent matchmaking system.

[Live Demo](https://smashnet-calculator.vercel.app) · [Report Bug](https://github.com/neahtSan/smashnet-calculator/issues) · [Request Feature](https://github.com/neahtSan/smashnet-calculator/issues)

</div>

## ✨ Features

### 🎯 Core Features
- **Player Management**
  - Add, edit, and delete players
  - Track player statistics
  - Maximum 7 players support
  - Real-time player stats updates

- **Intelligent Matchmaking**
  - Smart team balancing
  - Win rate consideration
  - Previous match history analysis
  - Special handling for first two matches

- **Match History**
  - Complete match tracking
  - Winner determination
  - Timestamp recording
  - Team composition history

### 🎨 UI/UX Features
- Modern, responsive design
- Ant Design components
- Tailwind CSS styling
- Dark/Light mode support
- Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - Ant Design
  - CSS Modules

### Development Tools
- **Package Manager**: PNPM/Bun
- **Type Checking**: TypeScript
- **Code Quality**: ESLint
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PNPM (recommended) or npm/yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/neahtSan/smashnet-calculator.git
cd smashnet-calculator
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start the development server**
```bash
pnpm run dev
```

4. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## 💻 Development

### Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

### Project Structure
```
smashnet-calculator/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── public/               # Static assets
└── package.json          # Project dependencies
```

## 🌐 Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy your application

### Deployment Features
- Automatic HTTPS
- Global CDN
- Continuous Deployment
- Preview Deployments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Ant Design](https://ant.design/) - An enterprise-class UI design language
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

---

<div align="center">
Made with ❤️ by [neahtSan](https://github.com/neahtSan)
</div>
