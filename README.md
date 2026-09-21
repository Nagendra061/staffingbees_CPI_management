# Staffingbees CPI Management

A modern web application for CPI (Cost Per Install / Consumer Price Index / Continuous Process Improvement - customize as needed) Management for Staffingbees, built with React, Redux Toolkit, Tailwind CSS, Vite, and an Express backend.

## 🚀 Tech Stack

- **Frontend:** React 19, Redux Toolkit, React Router, Tailwind CSS, Vite, Framer Motion, Lucide React
- **Backend:** Node.js, Express, TSX
- **AI Integration:** @google/genai
- **Language:** TypeScript

## 📋 Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (or bun/yarn)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nagendra061/staffingbees_CPI_management.git
   cd staffingbees_CPI_management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the `.env.example` file to `.env` or `.env.local` and add the necessary values (like your Gemini API Key if used).
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will start both the frontend Vite server and the backend Express server concurrently (via `server.ts`).

## 📦 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm start`: Runs the built production server.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs TypeScript type-checking.
- `npm run clean`: Removes the `dist` folder and server artifacts.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
