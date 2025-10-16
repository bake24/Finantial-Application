# Bitcoin Loan App

Progressive Web Application for Bitcoin loans with modern UI and offline support.

## Features

- 💰 Bitcoin loan application (up to 1 BTC, up to 24 months)
- 📊 Payment schedule with detailed breakdown
- 📈 Real-time Bitcoin price (CoinGecko API)
- 💳 Early repayment options
- 📱 PWA support with offline mode
- 🎨 Responsive design (mobile-first)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials
- **Username**: `demo`
- **Password**: `demo123`

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Recharts (charts)
- next-pwa (PWA support)

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Run production
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

## Project Structure

```
src/
├── pages/           # Next.js pages
├── widgets/         # Complex UI blocks
├── features/        # Business features
├── entities/        # Business entities
└── shared/          # Shared code
    ├── ui/          # UI components
    ├── lib/         # Utils and helpers
    └── config/      # Configuration
```

## Deployment

Deploy to Vercel (recommended):

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Deploy

Or use: Netlify, Railway, Render

## License

MIT
