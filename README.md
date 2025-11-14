# Breakfree

A React Native/Expo app designed to help you block distractions and maintain focus. Built with a minimal black and white design, Breakfree provides focus timers, app blocking, and messaging management.

## Features

- **Focus Timer**: Adjustable Pomodoro-style timer with slider control (1 minute to 8 hours)
- **App Blocking**: Block distracting apps and manage them from the home screen
- **Messaging**: Integrated messaging interface with support for multiple platforms (iMessage, WhatsApp, Telegram, etc.)
- **Schedule**: Plan and manage your focus sessions
- **Dark Theme**: Minimal black and white design for reduced eye strain
- **Onboarding Flow**: Guided setup to configure your focus preferences

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** (Stack & Bottom Tabs)
- **NativeWind** (Tailwind CSS for React Native)
- **Lucide React Native** for icons
- **Expo Linear Gradient** for gradients
- **AsyncStorage** for persistence
- **Open Sans** font family

## Project Structure

```
frontend/
├── (onboard)/          # Onboarding flow screens
│   ├── steps/          # Individual onboarding steps
│   ├── ui.tsx          # Shared UI components
│   └── OnboardingContext.tsx
├── (start)/            # Initial welcome screens
├── (main)/             # Main app screens
│   ├── screens/
│   │   ├── Home.tsx    # Timer and schedule
│   │   ├── messages/  # Messages stack
│   │   │   ├── page.tsx
│   │   │   └── [slug]/ # Dynamic message detail
│   │   └── ...
│   └── Tabs.tsx        # Bottom tab navigation
└── App.tsx             # Root navigation setup
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xntle/breakfree.git
cd breakfree
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npx expo start
```

5. Run on iOS simulator:
```bash
# Press 'i' in the terminal or
npx expo start --ios
```

6. Run on Android emulator:
```bash
# Press 'a' in the terminal or
npx expo start --android
```

## Development

### Code Style

- Use TypeScript with strict typing
- Functional components with hooks
- Follow React Native best practices
- Use `StyleSheet.create` for styles
- Prefer named exports for components
- Use camelCase for variables and functions
- Use PascalCase for components

### Design Principles

- **Dark Theme**: Primary background `#201f1f`, text `#ede9e9`
- **Minimal Design**: Clean black and white aesthetic
- **Mobile Optimized**: Max-width constraint (448px equivalent)
- **Typography**: Open Sans font family
- **Spacing**: Consistent spacing (8, 12, 16, 20, 24px)
- **Border Radius**: 10-20px for rounded elements

### Navigation

- Stack navigator for onboarding and main app transition
- Bottom tab navigator for main app (Home, Messages)
- Nested stack navigator for Messages (List → Detail)

### State Management

- Context API for onboarding state (`OnboardingContext`)
- AsyncStorage for persistence
- Local state with `useState` for component-specific state

## Features in Detail

### Focus Timer

- Adjustable timer with slider (1 minute to 8 hours)
- Start/Pause/Reset controls
- Quick start challenges (Pomodoro, Deep Work, Monk Mode, etc.)
- Real-time countdown

### App Blocking

- Block distracting apps (Instagram, TikTok, Twitter, Facebook, YouTube, Reddit, News, Games)
- Manage blocked apps from home screen banner
- Visual indicator of blocked apps count

### Messaging

- View all conversations in a texting-style interface
- Search and filter conversations
- Support for multiple messaging platforms
- Individual conversation detail screens
- Add new contacts or platforms

### Schedule

- Plan focus sessions throughout the day
- View scheduled sessions with time slots
- Add new schedule items

## Building for Production

### iOS

```bash
npx expo run:ios
```

### Android

```bash
npx expo run:android
```

## License

Private project - All rights reserved

## Contributing

This is a private project. For questions or suggestions, please contact the repository owner.

