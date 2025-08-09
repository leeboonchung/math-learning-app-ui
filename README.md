# Math Learning App (Duolingo Style)

A modern, engaging math learning app inspired by Duolingo. Built with React, TypeScript, Vite, and Material-UI.

## Features
- User authentication (placeholder)
- Dashboard with progress tracking
- Interactive math exercises with instant feedback
- Modern UI using Material-UI
- Routing and state management
- Mock data for exercises

## Getting Started

### Install dependencies
```
npm install
```

### Start the development server
```
npm run dev
```

### Folder Structure
- `src/components` – Reusable UI components
- `src/pages` – App pages (Dashboard, Login, Exercises, etc.)
- `src/services` – API/mocks for exercises and user data
- `src/styles` – Custom styles and theme

## To Do
- Implement authentication
- Add more exercise types
- Connect to backend (optional)

---

This project was bootstrapped with [Vite](https://vitejs.dev/) and uses [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/).

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
