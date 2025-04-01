# 🏸 Smashnet Calculator

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.2.26-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern web application for managing badminton tournaments with intelligent group distribution and matchmaking system.

[Live Demo](https://smashnet-calculator.vercel.app) · [Report Bug](https://github.com/neahtSan/smashnet-calculator/issues) · [Request Feature](https://github.com/neahtSan/smashnet-calculator/issues)

</div>

## 🎯 Current Status

The application is in beta, with the following implementation status:
- ✅ Single court logic (supporting up to 7 players)
- ✅ Badminton Cost Calculator
- ✅ Group distribution system
- ✅ Match result tracking
- ✅ Tournament statistics
- ✅ Interface organization
- 🚧 Multi-court logic (structure ready for up to 12 players)

## ✨ Features

### 🎮 Player Management
- **Dynamic Group Distribution**
  ```
  4 players  
  5 players  
  6 players  
  7 players 
  (Support ready for 8-12 players)
  ```
- Add/Edit/Delete players with name validation
- Real-time player statistics tracking
- Win rate calculations and rankings

### 🎯 Match System
- **Intelligent Matchmaking**
  - Fair player rotation system
  - Considers previous match history
  - Balances teams based on performance
  - Special handling for first matches
- **Match Controls**
  - Winner selection with confirmation
  - Match reversal capability
  - Match history tracking
  - Player performance updates

### 💰 Cost Calculator
- **Court Fee Management**
  - Hourly rate calculation
  - Flexible duration tracking
  - Total cost computation
- **Shuttlecock Expenses**
  - Per-piece pricing
  - Quantity tracking
  - Total cost summary
- **Additional Expenses**
  - Custom expense categories
  - Individual or shared cost allocation
  - Dynamic cost distribution
- **PromptPay Integration**
  - QR code generation
  - Individual payment amounts
  - Easy payment sharing

### 🏆 Tournament Features
- Live win/loss statistics
- Player rankings with tie handling
- Tournament reset functionality
- Match result verification
- Local storage persistence

## 🛠️ Technical Implementation

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - Ant Design Components
  - Responsive Design

### Project Structure
```
smashnet-calculator/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with global styles
│   ├── page.tsx           # Main application page
│   └── calculator/        # Cost calculator page
│
├── components/            # React components
│   ├── BadmintonCalculator/  # Cost calculator components
│   │   ├── AdditionalExpenses.tsx
│   │   ├── CostBreakdown.tsx
│   │   ├── CourtFeeSection.tsx
│   │   ├── PlayerListWithHours.tsx
│   │   ├── PromptPaySection.tsx
│   │   ├── QRCodeModal.tsx
│   │   ├── ShuttlecockSection.tsx
│   │   └── VerificationModal.tsx
│   ├── BadmintonCostCalculator.tsx
│   ├── CurrentMatch.tsx
│   ├── DeleteConfirmation.tsx
│   ├── FinishConfirmation.tsx
│   ├── PlayerForm.tsx
│   ├── PlayerList.tsx
│   ├── RevertMatchConfirmation.tsx
│   └── TournamentResults.tsx
│
├── interface/            # TypeScript interfaces
│   ├── calculator.ts    # Cost calculation interfaces
│   ├── match.ts        # Match management interfaces
│   ├── modal.ts        # Modal component interfaces
│   ├── player.ts       # Player management interfaces
│   ├── qrcode.ts       # QR code related interfaces
│   └── index.ts        # Interface exports
│
├── utils/               # Utility functions
│   ├── calculatorLogic.ts  # Cost calculation logic
│   ├── groupPlayer.ts      # Group distribution logic
│   └── matchmaker.ts       # Match creation logic
│
├── public/             # Static assets
├── .next/             # Next.js build output
├── node_modules/      # Dependencies
├── next.config.js     # Next.js configuration
├── package.json       # Project dependencies
├── postcss.config.js  # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm

### Quick Start
1. **Clone and Install**
   ```bash
   git clone https://github.com/neahtSan/smashnet-calculator.git
   cd smashnet-calculator
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🔜 Upcoming Features

- **Multi-Court Support**
  - Extended group sizes (8-12 players)
  - Parallel match management
  - Enhanced rotation system

- **Enhanced Statistics**
  - Tournament history
  - Player performance trends
  - Advanced analytics

- **UI/UX Improvements**
  - Match visualization
  - Tournament brackets
  - Player profiles

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

### Core Technologies
- [Next.js](https://nextjs.org/) - The React Framework for production
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Ant Design](https://ant.design/) - An enterprise-class UI design language

### Development Tools
- [ESLint](https://eslint.org/) - JavaScript linting utility
- [Prettier](https://prettier.io/) - Code formatter
- [Git](https://git-scm.com/) - Version control system
- [Vercel](https://vercel.com/) - Deployment platform

### Icons & Assets
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Emoji](https://emojipedia.org/) - For UI elements and badges

### Inspiration
- Badminton community feedback and suggestions
- Modern web development best practices
- User experience research in sports applications

---

<div align="center">
  <img src="https://github.com/neahtSan.png" width="80" style="border-radius: 50%;" alt="neahtSan Logo"/>
  <br>
  <strong>Made with ❤️ by <a href="https://github.com/neahtSan">neahtSan</a></strong>
</div>

