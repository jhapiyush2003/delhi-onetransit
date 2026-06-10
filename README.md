# 🚇 Delhi Smart Mobility System (DSMS)

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Recharts-2-22D3EE?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</p>

<p align="center">
  A full-featured unified transport dashboard for Delhi — Metro, DTC Bus, and EMU Trains in one smart platform.
</p>

---

## 🌐 Live Demo

👉 **[View Live on Vercel](https://delhi-smart-mobility.vercel.app)**

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| User | piyush@demo.com | demo123 |
| Admin | admin@dsms.in | admin123 |

---

## ✨ Features

### 🚇 Transport Coverage
- **9 Metro Lines** — Red, Yellow, Blue, Green, Pink, Magenta, Violet, Grey, Airport Express
- **8 DTC Bus Routes** — AC and regular routes across Delhi
- **6 EMU Train Routes** — Delhi to Ghaziabad, Faridabad, Palwal, Gurgaon, Sonipat, Rohtak

### 🗺️ Smart Route Planner
- **Dijkstra's Algorithm** for shortest path across the entire Metro network
- Multiple route options with fare, time, and interchange count
- One-click trip booking with automatic wallet deduction

### 👤 User Features
- Secure login / signup with simulated biometric setup (Face + Fingerprint)
- Personal wallet with top-up functionality
- Full trip history with date, route, mode, fare, and duration
- Monthly spending analytics with charts
- Profile management

### 📊 Analytics Dashboard
- Monthly revenue and trip trend charts (Area, Bar, Line)
- Mode distribution Pie chart (Metro / Bus / EMU)
- Top stations by footfall
- User growth tracking

### 🛡️ Admin Panel
- View all 1000+ registered users
- Revenue and trip statistics
- User growth and mode distribution charts
- Full system analytics

### 🎨 UI/UX
- Dark / Light mode toggle
- Fully responsive mobile-first design
- Smooth animations and transitions
- Color-coded metro lines matching real Delhi Metro map
- Toast notifications for all actions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 2 |
| Routing Algorithm | Dijkstra's Algorithm (custom) |
| Icons | Inline SVG (no icon library) |
| Deployment | Vercel |

---

## 🚀 Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/jhapiyush2003/delhi-smart-mobility.git
cd delhi-smart-mobility

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 📁 Project Structure

```
delhi-smart-mobility/
├── src/
│   ├── App.jsx          # Main app — all components in one file
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles + Tailwind
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Dependencies
└── README.md
```

---

## 🧠 Algorithm Highlight

The route planner uses **Dijkstra's Shortest Path Algorithm** on a custom-built metro graph:

```javascript
// Each station is a node; adjacent stations are edges with cost = travel time
function dijkstra(graph, start, end) {
  // Priority queue based shortest path
  // Returns: { path: [...stations], time: totalMinutes }
}
```
- Graph built from all 9 metro lines with interchange detection
- Handles multi-line journeys automatically
- Finds optimal path in milliseconds across 200+ stations

---

## 📸 Screenshots

> Add your screenshots here after deployment

---

## 🎯 What I Learned

- Implementing graph algorithms (Dijkstra) in a React frontend
- Managing complex shared state across many components
- Building a full-scale UI with Tailwind CSS without a component library
- Data generation and seeded randomness for realistic dummy data
- Deploying a Vite + React app to Vercel

---

## 👨‍💻 Author

**Piyush Jha**
- 🌐 [Portfolio](https://piyush-jha-portfolio-html.vercel.app)
- 💼 [LinkedIn](https://linkedin.com/in/piyushjha2003)
- 📧 piyushjha5377@gmail.com
- 🐙 [GitHub](https://github.com/jhapiyush2003)

---

<p align="center">Built with ❤️ for Delhi commuters</p>
