# replit.md

## Overview

This is a React-based web application built with Vite for fast development and hot module reloading. The project uses Firebase as its backend-as-a-service platform, providing authentication and database capabilities through Firebase Auth and Firestore. The application follows a single-page application (SPA) architecture with client-side routing via React Router.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with JSX (JavaScript XML)
- **Build Tool**: Vite 5 for development server and production builds
- **Routing**: React Router DOM v7 for client-side navigation
- **TypeScript Support**: TypeScript is configured and available, though current files use JSX extension

The application entry point is `src/index.jsx`, which renders into the root div in `index.html`. The Vite dev server is configured to listen on all network interfaces (`0.0.0.0`) for Replit compatibility.

### Backend Architecture

This is a frontend-only application that relies entirely on Firebase for backend services:

- **Authentication**: Firebase Auth handles user authentication
- **Database**: Firestore (NoSQL document database) for data persistence

### Configuration Pattern

Firebase configuration uses environment variables loaded via Vite's `import.meta.env` for security. All Firebase credentials should be stored as Replit Secrets with the `VITE_` prefix:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## External Dependencies

### Firebase Services

- **Firebase Auth** (`getAuth`): User authentication service
- **Firestore** (`getFirestore`): NoSQL document database for storing application data

Both services are initialized in `src/firebase.js` and exported for use throughout the application.

### Development Dependencies

- **Vite**: Build tool and development server
- **@vitejs/plugin-react**: React integration for Vite with Fast Refresh
- **TypeScript**: Available for type checking (files can be renamed from `.jsx` to `.tsx`)

### Runtime Dependencies

- **React & React DOM**: UI library
- **React Router DOM**: Client-side routing
- **Firebase SDK**: Backend services client