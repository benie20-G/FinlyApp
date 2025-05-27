# Finly

Smart Finance Management App

Finly is a modern, mobile-first personal finance management application built with Expo and React Native. It helps users track expenses, manage budgets, and gain insights into their financial habits with a beautiful, dark-themed interface.

## Features
- Dark mode UI with green accent
- User authentication (login)
- Dashboard with financial overview
- Expense tracking (add, edit, delete, filter)
- Budget management and progress tracking
- Category-based organization
- Profile and preferences
- Rwandan Franc (RWF) currency support
- Responsive and accessible design

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open the app in Expo Go or your emulator.

## Folder Structure
```
app/
  (auth)/         # Authentication screens (home, login)
  (tabs)/         # Main app tabs (dashboard, expenses, budgets, profile)
  _layout.tsx     # App layout and navigation
components/       # Reusable UI components
contexts/         # React Contexts for state management
services/         # API service modules
utils/            # Utility functions (formatters, validation)
```

## API Endpoints
See [`api-endpoints.txt`](./api-endpoints.txt) for a full list of backend endpoints used in this project.

## Customization
- To change the primary color, edit `Colors.primary` in `constants/Colors.ts`.
- To update the API base URL, edit `BASE_URL` in `services/api.ts`.

## License
MIT 