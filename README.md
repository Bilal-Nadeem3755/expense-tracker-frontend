# Expense Tracker — Frontend

A responsive expense-tracking web application built with **React**, **Tailwind CSS**, and **Vite**. It provides a dashboard for reviewing personal finances, managing transactions and categories, and viewing reports.

## Live Demo

- **Frontend:** https://expense-tracker-frontend-six-ochre.vercel.app
- **Backend API:** https://expense-tracker-backend-beige-rho.vercel.app

## Features

- User registration and login
- Protected application routes
- Dashboard with income, expenses, balance, and transaction insights
- Create, view, update, and delete transactions
- Filter transactions by type, category, and date
- Create, rename, and delete personal categories
- Reports with date-based summaries, category breakdowns, and trends
- Profile settings and password-management interface
- Responsive layout with sidebar navigation
- API requests handled with Axios
- JWT access token attached to authenticated requests

## Tech Stack

- React
- JavaScript (ES modules)
- Tailwind CSS
- Vite
- React Router
- Axios
- Lucide React
- ESLint

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AddTransactionModal.jsx
│   │   ├── AnimatedDropdown.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── StatCard.jsx
│   ├── pages/
│   │   ├── Categories.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Reports.jsx
│   │   ├── Settings.jsx
│   │   └── Transactions.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── categoryService.js
│   │   ├── transactionService.js
│   │   └── userService.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Run Locally

### Requirements

- Node.js and npm
- The Expense Tracker backend running locally or a reachable deployed API

### 1. Clone the repository

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd frontend
```

Replace `<YOUR_FRONTEND_REPOSITORY_URL>` with your frontend GitHub repository URL. If your repository already opens at the frontend project root, run the commands from that directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

The API base URL is currently configured in `src/services/api.js`. For local development, set it to your local FastAPI address, for example:

```javascript
baseURL: "http://127.0.0.1:8000"
```

Use the deployed backend URL when testing the deployed frontend.

### 4. Start the development server

```bash
npm run dev
```

Vite will print the local URL in the terminal, usually `http://localhost:5173`.

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the production app
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Backend Integration

The frontend communicates with the FastAPI backend for authentication, users, categories, transactions, dashboard data, and reports. The API client is defined in `src/services/api.js`; supporting service modules are in `src/services/`.

## Deployment

The frontend is deployed on Vercel. When deploying your own copy, configure the API base URL to point to your backend and ensure the backend CORS settings allow the frontend's domain.

## Notes

- Do not commit `node_modules/`, `dist/`, or local environment files.
- This project is intended as a personal finance tracking application and portfolio project.
