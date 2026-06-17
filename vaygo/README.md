# Vaygo — Smart Ride Sharing Platform

## Project Structure

```
vaygo/
├── package.json          ← root (runs both together)
├── client/               ← React + Vite + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/index.css
│       └── pages/
│           └── SplashPage.jsx
└── server/               ← Node + Express + MongoDB
    ├── index.js
    ├── .env
    ├── models/
    │   └── User.model.js
    └── routes/
        ├── auth.routes.js
        └── ride.routes.js
```

## Setup & Run

### 1. Install dependencies
```bash
# From root folder
npm run install:all
```

### 2. Configure environment
Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/vaygo
JWT_SECRET=your_secret_here
```

### 3. Run both together
```bash
npm run dev
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:5000
- MongoDB  → make sure it's running locally

## Pages Built So Far
- [x] SplashPage → `/`

## Pages Coming Next
- [ ] OnboardingPage  → `/onboarding`
- [ ] LanguagePage    → `/language`
- [ ] RegisterPage    → `/register`
- [ ] LoginPage       → `/login`
- [ ] OtpPage         → `/otp`
- [ ] KycPage         → `/kyc`
- [ ] ProfileSetupPage → `/profile-setup`
- [ ] RoleSelectPage  → `/role-select`
- [ ] PassengerHome   → `/passenger`
- [ ] DriverHome      → `/driver`
