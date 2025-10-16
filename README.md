# Currency Converter Web App

A stunning, production-ready currency converter with Apple-inspired design, built with Next.js 15 and modern web technologies.

## ✨ Features

### Core Functionality

- **Real-time Currency Conversion** - Instant conversion with live exchange rates
- **150+ Global Currencies** - Support for all major world currencies
- **Smart Search** - Quick currency search by name or code
- **Country Flags** - Visual currency identification with emoji flags
- **Exchange Rate History** - 30-day historical chart with trends
- **Favorites System** - Save frequently used conversions
- **Auto-refresh** - Rates automatically update every hour

### Design & UX

- **Apple-inspired UI** - Glassmorphism design with macOS/iOS aesthetics
- **Three Themes** - Light, Dark, and Blue accent themes
- **Smooth Animations** - Framer Motion powered transitions
- **Fully Responsive** - Perfect on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Power user support with hotkeys
- **Accessibility** - WCAG compliant with ARIA labels

### Technical Features

- **Offline Support** - Cached conversions work without internet
- **Error Handling** - Graceful fallbacks and user feedback
- **Performance Optimized** - Fast load times and smooth interactions
- **TypeScript** - Full type safety throughout

## 🎨 Design System

### Themes

- **Light Mode**: Clean glass-white aesthetic with subtle shadows
- **Dark Mode**: Elegant glass-black with blue accents
- **Blue Mode**: Fresh blue gradient with glassmorphism

### Visual Elements

- Rounded corners (border-radius: 2xl)
- Soft glassmorphism with blur effects
- Transparent layered panels
- Smooth hover states and micro-interactions

## ⌨️ Keyboard Shortcuts

- **⌘ + R** - Swap currencies
- **⌘ + F** - Add to favorites
- **1** - Switch to light theme
- **2** - Switch to dark theme
- **3** - Switch to blue theme
- **ESC** - Close dropdowns and clear search

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Historical rate charts
- **shadcn/ui** - Premium UI components

### Backend

- **Next.js API Routes** - Server-side functionality
- **Frankfurter.app API** - Free exchange rate data
- **localStorage** - Client-side persistence

### Development Tools

- **ESLint** - Code quality
- **TypeScript** - Static typing
- **Hot Reload** - Fast development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd currency-converter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── exchange-rates/     # API routes for currency data
│   ├── page.tsx               # Main application page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── currency-converter.tsx # Main converter component
├── hooks/
│   ├── use-currency-converter.ts  # Conversion logic
│   ├── use-keyboard-shortcuts.ts  # Keyboard shortcuts
│   └── use-toast.ts              # Toast notifications
├── types/
│   └── currency.ts            # TypeScript definitions
└── data/
    └── currencies.ts          # Currency data
```

## 🔧 Configuration

### API Integration

The app uses Frankfurter.app for free exchange rate data:

- No API key required
- Rate limits: 1,000 requests/hour
- Data updated every hour

### Customization

- **Add new currencies**: Edit `src/data/currencies.ts`
- **Modify themes**: Update theme classes in `src/components/currency-converter.tsx`
- **Change API endpoint**: Update `EXCHANGE_RATE_API` in `src/app/api/exchange-rates/route.ts`

## 🌐 API Endpoints

### Exchange Rates API

```
GET /api/exchange-rates
```

#### Parameters

- `from` - Source currency code (e.g., USD)
- `to` - Target currency code (e.g., EUR)
- `amount` - Amount to convert (optional)
- `historical` - Set to 'true' for 30-day history

#### Examples

```bash
# Get latest rate
GET /api/exchange-rates?from=USD&to=EUR

# Convert amount
GET /api/exchange-rates?from=USD&to=EUR&amount=100

# Get historical data
GET /api/exchange-rates?from=USD&to=EUR&historical=true
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Privacy & Security

- No user data collection
- All conversions processed client-side
- Exchange rate data from public APIs
- localStorage used only for preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Frankfurter.app** - Free exchange rate API
- **shadcn/ui** - Beautiful UI components
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

For questions or support:

- Create an issue on GitHub
- Check the documentation
- Review the code comments

---
