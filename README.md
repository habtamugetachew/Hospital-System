# 🏥 Devoryn Next-Gen Hospital Management System

Welcome to the **Devoryn Hospital Management System** – a futuristic, high-end, and cinematic React dashboard designed for the next generation of healthcare facilities. This project seamlessly integrates cutting-edge UI/UX with powerful dashboard functionality across multiple medical roles.

![Tech Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

---

## ✨ Key Features

This application features a strictly enforced **Dark Mode / Glassmorphic** aesthetic, simulating a high-tech medical operating system. It is divided into **four dedicated portals** with unique capabilities:

### 1. 🩺 Doctor's Dashboard
- **Holographic Anatomy Scanner:** A premium, high-fidelity static component featuring a stunning skeletal imaging asset embedded with clinical telemetry overlays (simulating a 4K resolution X-Ray/MRI interface).
- **EHR Form Management:** Easily log and track patient electronic health records.

### 2. 🤒 Patient Portal
- **AI Symptom Checker (Triage Engine):** An interactive, conversational-style UI where patients can input symptoms. The "AI" engine analyzes inputs in real-time, displaying a futuristic processing animation before offering diagnostic suggestions and automated triage routing.

### 3. 💊 Lab & Pharmacy Portal
- **Predictive Pharmacy Analytics:** A smart inventory system that uses predictive logic to analyze stock. Items falling below critical thresholds trigger severe "pulsing red" UI alerts to notify staff to restock immediately.

### 4. 👨‍💻 Admin Portal
- **Global System Telemetry:** View high-level metrics, revenue data, active staff routing, and critical hospital alerts in a stunning multi-grid dashboard.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 (Bootstrapped with Vite)
- **Styling:** Tailwind CSS (Strict custom dark-mode, glassmorphism, and neon glow effects)
- **Icons:** Lucide React
- **Animations:** Framer Motion (Cinematic page transitions, loaders, and micro-interactions)
- **Backend/Auth:** Firebase (Firestore DB & Firebase Authentication)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone or Download the Repository**
2. **Install Dependencies:**
   Open your terminal in the project directory and run:
   ```bash
   npm install
   ```
3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
4. **Open the App:** Navigate to `http://localhost:5173/` in your browser.

---

## 🔐 Mock Authentication (Test Accounts)

The application is currently running in a **Mock Mode** allowing you to easily test the role-based dashboards without setting up a real Firebase backend. 

**Password:** Any password with at least 4 characters will work! (e.g., `1234` or `password`)

Use the following emails on the login screen to access specific portals:

| Role | Login Email |
| :--- | :--- |
| **Admin** | `admin@healthcare.com` |
| **Doctor** | `doctor@healthcare.com` |
| **Patient** | `patient@healthcare.com` |
| **Pharmacy/Lab** | `staff@healthcare.com` |

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── StaticHoloScanner.jsx    # The premium anatomical skeleton UI
│   ├── AISymptomChecker.jsx     # The automated triage logic system
│   ├── PredictivePharmacy.jsx   # Pharmacy inventory analytics
│   └── EHRForm.jsx              # Electronic Health Records interface
├── dashboards/                  # Role-specific portal views
│   ├── AdminDashboard.jsx
│   ├── PatientDashboard.jsx
│   └── LabPharmacyDashboard.jsx
├── contexts/
│   └── AuthContext.jsx          # Firebase & Mock Authentication logic
├── firebase.js                  # Firebase configuration
├── App.jsx                      # Main router and layout orchestrator
└── index.css                    # Tailwind imports & custom animations
```

---

*Designed and developed to push the boundaries of modern medical software interfaces.*
