import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

// ─── DELHI DATA ───────────────────────────────────────────────────────────────
const METRO_LINES = {
  red:     { name: "Red Line",      color: "#E53E3E", stations: ["Rithala","Rohini West","Rohini East","Pitam Pura","Kohat Enclave","Netaji Subhash Place","Keshav Puram","Kanhaiya Nagar","Inderlok","Shastri Nagar","Pratap Nagar","Pulbangash","Tis Hazari","Kashmere Gate","Shyam Park","Mohan Nagar","Arthala","Hindon River","Shaheed Sthal"] },
  yellow:  { name: "Yellow Line",   color: "#ECC94B", stations: ["Samaypur Badli","Rohini Sector 18-19","Haiderpur Badli Mor","Jahangirpuri","Adarsh Nagar","Azadpur","Model Town","GTB Nagar","Vishwavidyalaya","Vidhan Sabha","Civil Lines","Kashmere Gate","Chandni Chowk","Chawri Bazar","New Delhi","Rajiv Chowk","Patel Chowk","Central Secretariat","Udyog Bhawan","Lok Kalyan Marg","Jor Bagh","INA","AIIMS","Green Park","Hauz Khas","Malviya Nagar","Saket","Sultanpur","Ghitorni","Arjan Garh","Guru Dronacharya","Sikandarpur","MG Road","IFFCO Chowk","Huda City Centre"] },
  blue:    { name: "Blue Line",     color: "#3182CE", stations: ["Dwarka Sector 21","Dwarka Sector 8","Dwarka Sector 9","Dwarka Sector 10","Dwarka Sector 11","Dwarka Sector 12","Dwarka Sector 13","Dwarka Sector 14","Dwarka","Dwarka Mor","Nawada","Uttam Nagar West","Uttam Nagar East","Janakpuri West","Janakpuri East","Tilak Nagar","Subhash Nagar","Tagore Garden","Rajouri Garden","Ramesh Nagar","Moti Nagar","Kirti Nagar","Shadipur","Patel Nagar","Rajendra Place","Karol Bagh","Jhandewalan","Ramakrishna Ashram Marg","Rajiv Chowk","Barakhamba Road","Mandi House","Supreme Court","Pragati Maidan","Indraprastha","Yamuna Bank","Akshardham","Mayur Vihar Phase-1","Mayur Vihar Extension","New Ashok Nagar","Noida Sector 15","Noida Sector 16","Noida Sector 18","Botanical Garden","Golf Course","Noida City Centre","Noida Sector 34","Noida Sector 52","Noida Sector 61","Noida Sector 59","Noida Sector 62","Noida Electronic City"] },
  green:   { name: "Green Line",    color: "#38A169", stations: ["Inderlok","Ashok Park Main","Punjabi Bagh West","ESI Hospital","Rajouri Garden","Madipur","Paschim Vihar East","Paschim Vihar West","Peeragarhi","Udyog Nagar","Surajmal Stadium","Nangloi","Nangloi Railway Station","Rajdhani Park","Mundka","Mundka Industrial Area","Ghevra","Tikri Kalan","Tikri Border","Pandit Shree Ram Sharma","Bahadurgarh City","Brigadier Hoshiyar Singh"] },
  pink:    { name: "Pink Line",     color: "#ED64A6", stations: ["Majlis Park","Azadpur","Shalimar Bagh","Netaji Subhash Place","Shakurpur","Punjabi Bagh West","ESI Hospital","Rajouri Garden","Naraina Vihar","Delhi Cantt","Durgabai Deshmukh South Campus","Sir M Visvesvaraya Moti Bagh","Bhikaji Cama Place","Sarojini Nagar","INA","South Extension","Lajpat Nagar","Vinobapuri","Ashram","Hazrat Nizamuddin","Mayur Vihar Phase-1","Mayur Vihar Pocket 1","Trilokpuri Sanjay Lake","East Vinod Nagar","Mandawali West Vinod Nagar","IP Extension","Anand Vihar","Karkarduma","Karkarduma Court","Krishna Nagar","East Azad Nagar","Welcome","Jaffrabad","Maujpur-Babarpur","Gokulpuri","Johri Enclave","Shiv Vihar"] },
  magenta: { name: "Magenta Line",  color: "#805AD5", stations: ["Janakpuri West","Dabri Mor","Dashrathpuri","Palam","Sadar Bazar Cantonment","Terminal 1 IGI Airport","Shankar Vihar","Vasant Vihar","Munirka","RK Puram","IIT","Hauz Khas","Panchsheel Park","Chirag Delhi","Greater Kailash","Nehru Enclave","Kalkaji Mandir","Okhla NSIC","Sukhdev Vihar","Jamia Millia Islamia","Okhla Vihar","Jasola Vihar Shaheen Bagh","Kalindi Kunj","Okhla Bird Sanctuary","Botanical Garden"] },
  violet:  { name: "Violet Line",   color: "#9F7AEA", stations: ["Kashmere Gate","Lal Qila","Jama Masjid","Delhi Gate","ITO","Mandi House","Janpath","Central Secretariat","Khan Market","Jawaharlal Nehru Stadium","Jangpura","Lajpat Nagar","Moolchand","Kailash Colony","Nehru Place","Kalkaji Mandir","Govind Puri","Okhla","Jasola Apollo","Sarita Vihar","Mohan Estate","Tughlakabad","Badarpur Border","Sarai","NHPC Chowk","Mewala Maharajpur","Sector 28 Faridabad","Bad Kal Mor","Old Faridabad","Neelam Chowk Ajronda","Bata Chowk","Escorts Mujesar"] },
  grey:    { name: "Grey Line",     color: "#718096", stations: ["Dwarka","Nangli","Najafgarh","Dhansa Bus Stand"] },
  airport: { name: "Airport Express",color: "#F6AD55", stations: ["New Delhi","Shivaji Stadium","Dhaula Kuan","Delhi Aerocity","IGI Airport","Dwarka Sector 21"] },
};

const BUS_ROUTES = [
  { number: "AC-1", name: "ISBT Kashmere Gate - Nehru Place", stops: ["ISBT Kashmere Gate","Delhi University","Mukherjee Nagar","Azadpur","Jahangirpuri","Rohini Sec-3","Pitampura","Kohat Enclave","Shalimar Bagh","Netaji Subhash Place","Raja Garden","Rajouri Garden","Tagore Garden","Janakpuri","Dwarka Mor","Uttam Nagar","Tilak Nagar","Rajendra Place","Karol Bagh","New Delhi Railway Station","Connaught Place","ITO","Pragati Maidan","Lajpat Nagar","Greater Kailash","Nehru Place"], fare: 25, time: 90 },
  { number: "AC-2", name: "DTC Depot Nangloi - AIIMS", stops: ["Nangloi","Mundka","Paschim Vihar","Punjabi Bagh","Rajouri Garden","Kirti Nagar","Moti Nagar","Patel Nagar","Karol Bagh","Jhandewalan","New Delhi Rly Stn","Connaught Place","Janpath","ITO","Mandi House","INA","AIIMS"], fare: 20, time: 75 },
  { number: "615", name: "Shahdara - New Delhi Station", stops: ["Shahdara","Seelampur","Yamuna Bank","Geeta Colony","IP Extension","Anand Vihar","Karkarduma","Akshardham","Mayur Vihar","Connaught Place","New Delhi Station"], fare: 15, time: 60 },
  { number: "500", name: "Badarpur - ISBT", stops: ["Badarpur","Sarita Vihar","Jasola","Okhla","Govind Puri","Kalkaji","Nehru Place","Moolchand","Lajpat Nagar","INA","Dilli Haat","Sarojini Nagar","AIIMS","ITO","Delhi Gate","Ajmeri Gate","ISBT Kashmere Gate"], fare: 18, time: 80 },
  { number: "302", name: "Dwarka - Connaught Place", stops: ["Dwarka Sec-21","Dwarka Sec-12","Dwarka","Dwarka Mor","Uttam Nagar","Janakpuri","Tilak Nagar","Subhash Nagar","Tagore Garden","Rajouri Garden","Moti Nagar","Karol Bagh","Connaught Place"], fare: 20, time: 65 },
  { number: "764", name: "Rohini - Nehru Place", stops: ["Rohini West","Rohini East","Pitampura","Netaji Subhash Place","Model Town","GTB Nagar","Delhi University","Civil Lines","Kashmere Gate","Chandni Chowk","New Delhi","Connaught Place","INA","Nehru Place"], fare: 22, time: 85 },
  { number: "411", name: "Noida Sec-62 - New Delhi", stops: ["Noida Sec-62","Noida Sec-61","Noida Sec-52","Noida City Centre","Botanical Garden","Mayur Vihar","Akshardham","Yamuna Bank","IP Extension","ITO","Mandi House","Connaught Place","New Delhi"], fare: 30, time: 90 },
  { number: "731", name: "Gurgaon - Central Secretariat", stops: ["Huda City Centre","Sikandarpur","MG Road","IFFCO Chowk","Guru Dronacharya","Arjan Garh","Saket","Hauz Khas","INA","Central Secretariat"], fare: 35, time: 70 },
];

const EMU_TRAINS = [
  { number: "74001", name: "Delhi - Ghaziabad", route: "Delhi → Shahdara → Ghaziabad", stations: ["Delhi Main","Shahdara","Ghonda","Mandoli","Sahibabad","Ghaziabad"], fare: 10, time: 45 },
  { number: "74003", name: "Delhi - Faridabad", route: "Delhi → Hazrat Nizamuddin → Faridabad", stations: ["Delhi Main","Hazrat Nizamuddin","Okhla","Tughlakabad","Badarpur","Faridabad"], fare: 12, time: 50 },
  { number: "74005", name: "Delhi - Palwal", route: "Delhi → Faridabad → Palwal", stations: ["Delhi Main","Hazrat Nizamuddin","Okhla","Faridabad","Ballabhgarh","Palwal"], fare: 18, time: 75 },
  { number: "74007", name: "Delhi - Gurgaon", route: "Delhi → New Delhi → Gurgaon", stations: ["Delhi Main","New Delhi","Palam","Gurgaon"], fare: 15, time: 40 },
  { number: "74009", name: "Delhi - Sonipat", route: "Delhi → Shakurbasti → Sonipat", stations: ["Delhi Main","Shakurbasti","Narela","Sonipat"], fare: 20, time: 60 },
  { number: "74011", name: "Delhi - Rohtak", route: "Delhi → Shakurbasti → Rohtak", stations: ["Delhi Main","Shakurbasti","Bahadurgarh","Rohtak"], fare: 25, time: 90 },
];

// ─── GENERATE 1000 DUMMY USERS ────────────────────────────────────────────────
const NAMES = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Rahul","Rajan","Karan","Rohan","Neha","Priya","Anjali","Pooja","Sneha","Divya","Kavya","Tanvi","Riya","Meera","Amit","Suresh","Mahesh","Ramesh","Deepak","Vikram","Sanjay","Ajay","Vijay","Gaurav","Sunita","Rekha","Geeta","Anita","Usha","Radha","Seema","Kavita","Asha","Lata"];
const SURNAMES = ["Sharma","Verma","Gupta","Singh","Kumar","Yadav","Jha","Mishra","Pandey","Tiwari","Agarwal","Bansal","Garg","Jain","Arora","Bhatia","Chopra","Dhawan","Kapoor","Khanna","Malhotra","Nanda","Oberoi","Puri","Sethi","Tandon","Wadhwa","Saxena","Srivastava","Dubey"];
const STATIONS_POOL = ["Rajiv Chowk","Kashmere Gate","Hauz Khas","Lajpat Nagar","Karol Bagh","Nehru Place","Dwarka","Rohini East","Pitampura","Shalimar Bagh","Connaught Place","INA","AIIMS","Janakpuri West","Akshardham","Mayur Vihar","Noida City Centre","Botanical Garden","New Delhi","ITO"];
const MODES = ["Metro","Bus","EMU"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateUsers() {
  const users = [];
  for (let i = 0; i < 1000; i++) {
    const rng = seededRandom(i * 997 + 13);
    const name = NAMES[Math.floor(rng() * NAMES.length)] + " " + SURNAMES[Math.floor(rng() * SURNAMES.length)];
    const phone = "9" + String(Math.floor(rng() * 900000000 + 100000000));
    const balance = Math.floor(rng() * 2000 + 50);
    const trips = Math.floor(rng() * 300 + 20);
    const metro = Math.floor(trips * (0.4 + rng() * 0.3));
    const bus = Math.floor(trips * (0.2 + rng() * 0.2));
    const emu = trips - metro - bus;
    const totalSpent = metro * 35 + bus * 22 + emu * 15;
    const history = [];
    for (let j = 0; j < Math.min(10, trips); j++) {
      history.push({
        date: new Date(2025, Math.floor(rng() * 12), Math.floor(rng() * 28) + 1).toLocaleDateString("en-IN"),
        from: STATIONS_POOL[Math.floor(rng() * STATIONS_POOL.length)],
        to: STATIONS_POOL[Math.floor(rng() * STATIONS_POOL.length)],
        mode: MODES[Math.floor(rng() * 3)],
        fare: Math.floor(rng() * 50 + 10),
        duration: Math.floor(rng() * 60 + 20),
      });
    }
    const monthlySpend = MONTHS.map(m => ({ month: m, amount: Math.floor(rng() * 800 + 200) }));
    users.push({ id: `USR${String(i + 1).padStart(4, "0")}`, name, email: name.toLowerCase().replace(" ", ".") + `${i}@gmail.com`, phone, balance, trips, metro, bus, emu, totalSpent, history, monthlySpend, joined: new Date(2023, Math.floor(rng() * 24), Math.floor(rng() * 28) + 1).toLocaleDateString("en-IN"), favoriteRoute: `${STATIONS_POOL[Math.floor(rng() * 10)]} → ${STATIONS_POOL[Math.floor(rng() * 10) + 10]}` });
  }
  return users;
}

const ALL_USERS = generateUsers();

// ─── DIJKSTRA ROUTE PLANNER ───────────────────────────────────────────────────
function buildMetroGraph() {
  const graph = {};
  Object.entries(METRO_LINES).forEach(([lineKey, line]) => {
    line.stations.forEach((s, i) => {
      if (!graph[s]) graph[s] = [];
      if (i > 0) {
        graph[s].push({ to: line.stations[i - 1], cost: 3, time: 3, line: line.name, color: line.color });
        graph[line.stations[i - 1]].push({ to: s, cost: 3, time: 3, line: line.name, color: line.color });
      }
    });
  });
  const interchanges = ["Rajiv Chowk","Kashmere Gate","Central Secretariat","Mandi House","INA","ITO","Kalkaji Mandir","Hauz Khas","Inderlok","Netaji Subhash Place","Punjabi Bagh West","Rajouri Garden","Lajpat Nagar","Anand Vihar","Dwarka","Janakpuri West","Botanical Garden","Mayur Vihar Phase-1","ESI Hospital","Azadpur"];
  interchanges.forEach(s => { if (graph[s]) { graph[s].forEach(e => { e.interchange = true; }); } });
  return graph;
}

const METRO_GRAPH = buildMetroGraph();

function dijkstra(graph, start, end) {
  if (!graph[start] || !graph[end]) return null;
  const dist = {}, prev = {}, visited = new Set();
  Object.keys(graph).forEach(n => dist[n] = Infinity);
  dist[start] = 0;
  const pq = [[0, start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u === end) break;
    (graph[u] || []).forEach(({ to, time }) => {
      const nd = d + time;
      if (nd < dist[to]) { dist[to] = nd; prev[to] = u; pq.push([nd, to]); }
    });
  }
  if (dist[end] === Infinity) return null;
  const path = [];
  let c = end;
  while (c) { path.unshift(c); c = prev[c]; }
  return { path, time: dist[end] };
}

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    metro: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/><path d="M9 21v-2M15 21v-2"/></svg>,
    bus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M8 6v6M15 6v6M2 12h19.6M18 18h2a1 1 0 001-1v-5M18 18H6M2 18h4M2 6h16a2 2 0 012 2v4H2V8a2 2 0 012-2z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>,
    train: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 2M16 19l2 2M8 19h8"/></svg>,
    wallet: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><circle cx="18" cy="12" r="2"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    fingerprint: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 10a2 2 0 01-2 2c-1.86 0-4-1.22-4-5 0-3 2-5 6-5s6 2 6 5c0 3.5-2.33 6.36-4 8"/><path d="M6 14a12.6 12.6 0 01-2 6"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M12 10a5 5 0 005 5"/><path d="M12 15c0 2.5-1.5 6.5-2 8"/></svg>,
    face: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    scan: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>,
    admin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return icons[name] || null;
};

// ─── THEME ────────────────────────────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(true);
  return { dark, toggle: () => setDark(d => !d) };
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme();
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulated registered users (start with 2 demo accounts)
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: "USR0001", name: "Piyush Jha", email: "piyush@demo.com", phone: "9876543210", password: "demo123", balance: 850, trips: 142, metro: 88, bus: 32, emu: 22, totalSpent: 4820, history: ALL_USERS[0].history, monthlySpend: ALL_USERS[0].monthlySpend, joined: "01/01/2024", favoriteRoute: "Pitampura → Rajiv Chowk" },
    { id: "USR0002", name: "Admin User", email: "admin@dsms.in", phone: "9999999999", password: "admin123", balance: 2000, trips: 0, metro: 0, bus: 0, emu: 0, totalSpent: 0, history: [], monthlySpend: MONTHS.map(m => ({ month: m, amount: 0 })), joined: "01/01/2023", favoriteRoute: "N/A", isAdmin: true },
  ]);

  const notify = (msg, type = "success") => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); };
  const bg = dark ? "bg-gray-950" : "bg-gray-50";
  const card = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const sub = dark ? "text-gray-400" : "text-gray-500";
  const inp = dark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500" : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500";

  const theme = { dark, card, text, sub, inp, bg };

  const navigate = (p) => { setPage(p); setSidebarOpen(false); };

  const updateUser = (updated) => {
    setUser(updated);
    setRegisteredUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  // Pages requiring auth
  const privatePages = ["dashboard","metro","bus","emu","wallet","history","analytics","notifications","profile","settings","admin","planner"];
  useEffect(() => { if (privatePages.includes(page) && !user) navigate("home"); }, [page, user]);

  const pages = {
    home: <Home dark={dark} toggle={toggle} user={user} setUser={setUser} navigate={navigate} authMode={authMode} setAuthMode={setAuthMode} registeredUsers={registeredUsers} setRegisteredUsers={setRegisteredUsers} notify={notify} theme={theme} />,
    dashboard: <Dashboard user={user} navigate={navigate} theme={theme} dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} />,
    planner: <RoutePlanner theme={theme} dark={dark} toggle={toggle} user={user} updateUser={updateUser} notify={notify} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    metro: <MetroRoutes theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    bus: <BusRoutes theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    emu: <EMURoutes theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    wallet: <Wallet user={user} updateUser={updateUser} notify={notify} theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    history: <TravelHistory user={user} theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    analytics: <UserAnalytics user={user} theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    notifications: <Notifications user={user} theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    profile: <Profile user={user} updateUser={updateUser} notify={notify} theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    settings: <Settings dark={dark} toggle={toggle} theme={theme} navigate={navigate} setSidebarOpen={setSidebarOpen} />,
    admin: <AdminDashboard theme={theme} dark={dark} toggle={toggle} navigate={navigate} setSidebarOpen={setSidebarOpen} allUsers={ALL_USERS} registeredUsers={registeredUsers} />,
  };

  return (
    <div className={`${bg} ${text} min-h-screen font-sans transition-colors duration-300`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 transition-all ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {notification.type === "success" ? <Icon name="check" size={16} /> : "✕"} {notification.msg}
        </div>
      )}
      {/* Sidebar overlay */}
      {sidebarOpen && user && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <Sidebar navigate={navigate} setUser={setUser} page={page} dark={dark} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
        </div>
      )}
      {pages[page] || pages.home}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ navigate, setUser, page, dark, user }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "planner", label: "Route Planner", icon: "map" },
    { id: "metro", label: "Metro Routes", icon: "metro" },
    { id: "bus", label: "Bus Routes", icon: "bus" },
    { id: "emu", label: "EMU Trains", icon: "train" },
    { id: "wallet", label: "Smart Wallet", icon: "wallet" },
    { id: "history", label: "Travel History", icon: "history" },
    { id: "analytics", label: "My Analytics", icon: "chart" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "profile", label: "Profile", icon: "user" },
    { id: "settings", label: "Settings", icon: "settings" },
    ...(user?.isAdmin ? [{ id: "admin", label: "Admin Dashboard", icon: "admin" }] : []),
  ];
  const bg = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const sub = dark ? "text-gray-400" : "text-gray-500";
  const hover = dark ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const active = dark ? "bg-blue-600 text-white" : "bg-blue-600 text-white";
  return (
    <div className={`relative z-50 w-72 h-screen ${bg} border-r flex flex-col`}>
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">D</div>
          <div>
            <div className={`font-bold text-sm ${text}`}>Delhi Smart Mobility</div>
            <div className={`text-xs ${sub}`}>{user?.name}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <button key={item.id} onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${page === item.id ? active : `${text} ${hover}`}`}>
            <Icon name={item.icon} size={18} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={() => { setUser(null); navigate("home"); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
          <Icon name="logout" size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function TopBar({ title, dark, toggle, setSidebarOpen, navigate, user }) {
  const bg = dark ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200";
  const text = dark ? "text-gray-100" : "text-gray-900";
  return (
    <div className={`sticky top-0 z-30 ${bg} backdrop-blur border-b px-4 py-3 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-lg hover:bg-gray-700/50 ${text}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span className={`font-bold text-base ${text}`}>{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggle} className={`p-2 rounded-lg hover:bg-gray-700/50 ${text} text-sm`}>{dark ? "☀️" : "🌙"}</button>
        <button onClick={() => navigate("notifications")} className={`p-2 rounded-lg hover:bg-gray-700/50 ${text}`}><Icon name="bell" size={18} /></button>
        <button onClick={() => navigate("profile")} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{user?.name?.[0]}</button>
      </div>
    </div>
  );
}

// ─── HOME / AUTH ──────────────────────────────────────────────────────────────
function Home({ dark, toggle, user, setUser, navigate, authMode, setAuthMode, registeredUsers, setRegisteredUsers, notify, theme }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [biometric, setBiometric] = useState({ face: false, finger: false });
  const [scanning, setScanning] = useState({ face: false, finger: false });
  const [step, setStep] = useState(1); // 1=form, 2=biometric
  const { card, text, sub, inp } = theme;

  useEffect(() => { if (user) navigate("dashboard"); }, [user]);

  const simulateScan = (type) => {
    setScanning(s => ({ ...s, [type]: true }));
    setTimeout(() => { setScanning(s => ({ ...s, [type]: false })); setBiometric(b => ({ ...b, [type]: true })); }, 2000);
  };

  const handleAuth = () => {
    if (authMode === "login") {
      const found = registeredUsers.find(u => u.email === form.email && u.password === form.password);
      if (found) { setUser(found); notify(`Welcome back, ${found.name}!`); navigate("dashboard"); }
      else notify("Invalid credentials", "error");
    } else {
      if (!form.name || !form.email || !form.phone || !form.password) { notify("Fill all fields", "error"); return; }
      if (step === 1) { setStep(2); return; }
      const newUser = {
        id: `USR${String(registeredUsers.length + 1).padStart(4, "0")}`,
        name: form.name, email: form.email, phone: form.phone, password: form.password,
        balance: 200, trips: 0, metro: 0, bus: 0, emu: 0, totalSpent: 0,
        history: [], monthlySpend: MONTHS.map(m => ({ month: m, amount: 0 })),
        joined: new Date().toLocaleDateString("en-IN"), favoriteRoute: "N/A",
      };
      setRegisteredUsers(prev => [...prev, newUser]);
      setUser(newUser);
      notify(`Account created! Welcome, ${form.name}!`);
      navigate("dashboard");
    }
  };

  return (
    <div className={`min-h-screen ${dark ? "bg-gray-950" : "bg-gray-50"} flex flex-col`}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative px-6 py-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-black text-xl">D</div>
            <div>
              <div className="text-white font-black text-lg tracking-tight">Delhi Smart Mobility</div>
              <div className="text-blue-200 text-xs">Unified Transport System</div>
            </div>
            <button onClick={toggle} className="ml-auto text-white/70 hover:text-white text-sm px-3 py-1 rounded-lg bg-white/10">{dark ? "☀️" : "🌙"}</button>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            One Card.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">All of Delhi.</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-xl">Metro · Bus · EMU Trains — unified in one smart platform. Plan routes, pay fares, track journeys.</p>
          <div className="flex flex-wrap gap-3">
            {[["🚇","Metro","9 Lines"], ["🚌","DTC Bus","500+ Routes"], ["🚆","EMU Train","6 Lines"]].map(([e, n, c]) => (
              <div key={n} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur text-white text-sm">
                <span>{e}</span><span className="font-semibold">{n}</span><span className="text-white/60">·</span><span className="text-white/70">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className={`w-full max-w-md ${card} border rounded-2xl p-8 shadow-2xl`}>
          <div className="flex gap-2 mb-8 p-1 rounded-xl bg-gray-800/50">
            {["login","signup"].map(m => (
              <button key={m} onClick={() => { setAuthMode(m); setStep(1); setBiometric({ face: false, finger: false }); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${authMode === m ? "bg-blue-600 text-white shadow" : sub}`}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {authMode === "signup" && step === 2 ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-lg font-bold ${text} mb-1`}>Biometric Setup</div>
                <div className={`text-sm ${sub}`}>Simulate face & fingerprint registration</div>
              </div>
              <div className="space-y-4">
                {[["face", "Face Recognition", "face"], ["finger", "Fingerprint", "fingerprint"]].map(([key, label, icon]) => (
                  <div key={key} className={`p-4 rounded-xl border ${dark ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${biometric[key] ? "bg-green-500" : "bg-gray-700"}`}>
                        <Icon name={icon} size={20} className="text-white" />
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${text}`}>{label}</div>
                        <div className={`text-xs ${sub}`}>{biometric[key] ? "Registered ✓" : scanning[key] ? "Scanning..." : "Not registered"}</div>
                      </div>
                    </div>
                    <button onClick={() => simulateScan(key)} disabled={biometric[key] || scanning[key]}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${biometric[key] ? "bg-green-500/20 text-green-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                      {scanning[key] ? <span className="animate-pulse">Scanning…</span> : biometric[key] ? "Done" : "Scan"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-gray-500">Biometric is optional for this demo</div>
              <button onClick={handleAuth} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition-all">
                Complete Registration →
              </button>
              <button onClick={() => setStep(1)} className={`w-full text-center text-sm ${sub} hover:${text}`}>← Back</button>
            </div>
          ) : (
            <div className="space-y-4">
              {authMode === "signup" && (
                <>
                  <input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inp}`} />
                  <input placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inp}`} />
                </>
              )}
              <input placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inp}`} />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inp}`} />

              {authMode === "login" && (
                <div className={`text-xs ${sub} p-3 rounded-xl bg-blue-500/10 border border-blue-500/20`}>
                  <div className="font-medium text-blue-400 mb-1">Demo Accounts</div>
                  <div>📧 piyush@demo.com / demo123</div>
                  <div>📧 admin@dsms.in / admin123 (Admin)</div>
                </div>
              )}

              <button onClick={handleAuth}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg">
                {authMode === "login" ? "Sign In →" : "Next: Biometric Setup →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, navigate, theme, dark, toggle, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const stats = [
    { label: "Wallet Balance", value: `₹${user.balance}`, icon: "wallet", color: "from-blue-500 to-cyan-500", alert: user.balance < 50 },
    { label: "Total Trips", value: user.trips, icon: "history", color: "from-purple-500 to-pink-500" },
    { label: "Total Spent", value: `₹${user.totalSpent}`, icon: "chart", color: "from-orange-500 to-red-500" },
    { label: "Metro Trips", value: user.metro, icon: "metro", color: "from-green-500 to-teal-500" },
  ];
  const quickLinks = [
    { id: "planner", label: "Plan Route", icon: "map", color: "bg-blue-600" },
    { id: "metro", label: "Metro", icon: "metro", color: "bg-red-500" },
    { id: "bus", label: "Bus", icon: "bus", color: "bg-orange-500" },
    { id: "emu", label: "EMU Train", icon: "train", color: "bg-green-600" },
    { id: "wallet", label: "Wallet", icon: "wallet", color: "bg-purple-600" },
    { id: "analytics", label: "Analytics", icon: "chart", color: "bg-pink-600" },
  ];
  return (
    <div className="min-h-screen">
      <TopBar title="Dashboard" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={user} />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="text-sm text-blue-200 mb-1">Good {new Date().getHours() < 12 ? "Morning" : "Evening"} 👋</div>
          <div className="text-2xl font-black">{user.name}</div>
          <div className="text-sm text-blue-200 mt-1">ID: {user.id} · Member since {user.joined}</div>
          {user.balance < 50 && <div className="mt-3 text-xs bg-red-500/30 border border-red-400/40 rounded-lg px-3 py-2">⚠️ Low balance! Please top up your wallet.</div>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`${card} border rounded-2xl p-4 ${s.alert ? "border-red-500/50" : ""}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <Icon name={s.icon} size={18} className="text-white" />
              </div>
              <div className={`text-xl font-black ${text}`}>{s.value}</div>
              <div className={`text-xs ${sub}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <div className={`text-sm font-semibold ${sub} mb-3`}>Quick Access</div>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(l => (
              <button key={l.id} onClick={() => navigate(l.id)}
                className={`${card} border rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}>
                <div className={`w-10 h-10 rounded-xl ${l.color} flex items-center justify-center`}>
                  <Icon name={l.icon} size={18} className="text-white" />
                </div>
                <span className={`text-xs font-medium ${text}`}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Trips */}
        {user.history.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className={`text-sm font-semibold ${sub}`}>Recent Trips</div>
              <button onClick={() => navigate("history")} className="text-xs text-blue-400 hover:text-blue-300">View All →</button>
            </div>
            <div className="space-y-2">
              {user.history.slice(0, 3).map((t, i) => (
                <div key={i} className={`${card} border rounded-xl p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.mode === "Metro" ? "bg-blue-500/20 text-blue-400" : t.mode === "Bus" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}>
                      <Icon name={t.mode === "Metro" ? "metro" : t.mode === "Bus" ? "bus" : "train"} size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-medium ${text}`}>{t.from} → {t.to}</div>
                      <div className={`text-xs ${sub}`}>{t.date} · {t.duration} min</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold text-red-400`}>-₹{t.fare}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.isAdmin && (
          <button onClick={() => navigate("admin")}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center gap-2">
            <Icon name="admin" size={20} /> Open Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ROUTE PLANNER ────────────────────────────────────────────────────────────
function RoutePlanner({ theme, dark, toggle, user, updateUser, notify, navigate, setSidebarOpen }) {
  const { card, text, sub, inp } = theme;
  const allStations = Object.values(METRO_LINES).flatMap(l => l.stations).filter((s, i, a) => a.indexOf(s) === i);
  const [from, setFrom] = useState("Shalimar Bagh");
  const [to, setTo] = useState("Dilshad Garden");
  const [results, setResults] = useState(null);
  const [booked, setBooked] = useState(null);

  const planRoute = () => {
    const r = dijkstra(METRO_GRAPH, from, to);
    if (!r) { notify("No route found between these stations", "error"); return; }
    const baseTime = r.time;
    const baseFare = Math.max(10, Math.floor(r.path.length * 3.5));
    setResults([
      { label: "Fastest Route", mode: "Metro Only", fare: baseFare + 5, time: baseTime, interchanges: Math.floor(r.path.length / 8), walking: "200m", path: r.path, color: "blue" },
      { label: "Cheapest Route", mode: "Bus + Metro", fare: Math.floor(baseFare * 0.7), time: baseTime + 20, interchanges: 1, walking: "500m", path: r.path, color: "green" },
      { label: "Min. Interchanges", mode: "EMU + Metro", fare: Math.floor(baseFare * 0.55), time: baseTime + 25, interchanges: 0, walking: "800m", path: r.path, color: "purple" },
      { label: "Least Walking", mode: "Metro Direct", fare: baseFare + 10, time: baseTime + 10, interchanges: 2, walking: "50m", path: r.path, color: "orange" },
    ]);
    setBooked(null);
  };

  const bookTrip = (opt) => {
    if (user.balance < opt.fare) { notify("Insufficient wallet balance! Please top up.", "error"); return; }
    const updated = {
      ...user, balance: user.balance - opt.fare, trips: user.trips + 1,
      metro: user.metro + (opt.mode.includes("Metro") ? 1 : 0),
      bus: user.bus + (opt.mode.includes("Bus") ? 1 : 0),
      emu: user.emu + (opt.mode.includes("EMU") ? 1 : 0),
      totalSpent: user.totalSpent + opt.fare,
      history: [{ date: new Date().toLocaleDateString("en-IN"), from, to, mode: opt.mode.split(" ")[0], fare: opt.fare, duration: opt.time }, ...user.history],
    };
    updateUser(updated);
    setBooked(opt);
    notify(`Trip booked! ₹${opt.fare} deducted from wallet.`);
  };

  const colorMap = { blue: "border-blue-500 bg-blue-500/10", green: "border-green-500 bg-green-500/10", purple: "border-purple-500 bg-purple-500/10", orange: "border-orange-500 bg-orange-500/10" };
  const badgeMap = { blue: "bg-blue-500", green: "bg-green-500", purple: "bg-purple-500", orange: "bg-orange-500" };

  return (
    <div className="min-h-screen">
      <TopBar title="Route Planner" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={user} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className={`${card} border rounded-2xl p-6 space-y-4`}>
          <div className={`text-sm font-semibold ${sub} flex items-center gap-2`}><Icon name="map" size={16} /> Plan Your Journey</div>
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${sub} mb-1 block`}>From Station</label>
              <select value={from} onChange={e => setFrom(e.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${inp}`}>
                {allStations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-center">
              <button onClick={() => { const t = from; setFrom(to); setTo(t); }} className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all">⇅</button>
            </div>
            <div>
              <label className={`text-xs ${sub} mb-1 block`}>To Station</label>
              <select value={to} onChange={e => setTo(e.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${inp}`}>
                {allStations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button onClick={planRoute} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition-all">
            Find Routes →
          </button>
        </div>

        {results && (
          <div className="space-y-3">
            <div className={`text-sm font-semibold ${sub}`}>Route Options — {from} → {to}</div>
            {results.map((opt, i) => (
              <div key={i} className={`border-2 ${colorMap[opt.color]} rounded-2xl p-5 transition-all ${booked?.label === opt.label ? "ring-2 ring-green-400" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white ${badgeMap[opt.color]} mb-2`}>{opt.label}</div>
                    <div className={`text-base font-bold ${text}`}>{opt.mode}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black ${text}`}>₹{opt.fare}</div>
                    <div className={`text-xs ${sub}`}>{opt.time} min</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className={`text-center p-2 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <div className={`text-xs ${sub}`}>Interchanges</div>
                    <div className={`font-bold ${text}`}>{opt.interchanges}</div>
                  </div>
                  <div className={`text-center p-2 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <div className={`text-xs ${sub}`}>Walking</div>
                    <div className={`font-bold ${text}`}>{opt.walking}</div>
                  </div>
                  <div className={`text-center p-2 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <div className={`text-xs ${sub}`}>Stops</div>
                    <div className={`font-bold ${text}`}>{opt.path.length}</div>
                  </div>
                </div>
                {booked?.label === opt.label ? (
                  <div className="text-center py-2 text-green-400 font-semibold text-sm flex items-center justify-center gap-2"><Icon name="check" size={16} /> Trip Booked!</div>
                ) : (
                  <button onClick={() => bookTrip(opt)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-all">
                    Book — ₹{opt.fare}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── METRO ROUTES ─────────────────────────────────────────────────────────────
function MetroRoutes({ theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const [selected, setSelected] = useState(null);
  return (
    <div className="min-h-screen">
      <TopBar title="Metro Routes" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={{name:"U"}} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {Object.entries(METRO_LINES).map(([key, line]) => (
          <div key={key} className={`${card} border rounded-2xl overflow-hidden`}>
            <button onClick={() => setSelected(selected === key ? null : key)}
              className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: line.color + "30", border: `2px solid ${line.color}` }}>
                  <Icon name="metro" size={18} style={{ color: line.color }} />
                </div>
                <div className="text-left">
                  <div className={`font-bold text-sm ${text}`}>{line.name}</div>
                  <div className={`text-xs ${sub}`}>{line.stations.length} stations</div>
                </div>
              </div>
              <div style={{ color: line.color }} className="font-mono text-xs font-bold">{selected === key ? "▲" : "▼"}</div>
            </button>
            {selected === key && (
              <div className="px-4 pb-4">
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: line.color }} />
                  <div className="space-y-1">
                    {line.stations.map((s, i) => {
                      const isInterchange = Object.values(METRO_LINES).filter(l => l !== line).some(l => l.stations.includes(s));
                      return (
                        <div key={s} className="flex items-center gap-3 pl-6 relative">
                          <div className="absolute left-2 w-2 h-2 rounded-full border-2" style={{ backgroundColor: isInterchange ? line.color : dark ? "#374151" : "#E5E7EB", borderColor: line.color }} />
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${text}`}>{s}</span>
                            {isInterchange && <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">Interchange</span>}
                          </div>
                          {i < line.stations.length - 1 && <span className={`text-xs ${sub} ml-auto`}>~3 min</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={`mt-4 p-3 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-100"} text-xs ${sub}`}>
                  Estimated end-to-end fare: ₹{10 + line.stations.length * 2} · Time: ~{line.stations.length * 3} min
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUS ROUTES ───────────────────────────────────────────────────────────────
function BusRoutes({ theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = BUS_ROUTES.filter(r => r.number.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="min-h-screen">
      <TopBar title="Bus Routes" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={{name:"U"}} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <input placeholder="Search bus number or route..." value={search} onChange={e => setSearch(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${dark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900"}`} />
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.number} className={`${card} border rounded-2xl overflow-hidden`}>
              <button onClick={() => setSelected(selected === r.number ? null : r.number)} className="w-full p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-black text-sm">{r.number}</span>
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-bold text-sm ${text}`}>{r.name}</div>
                  <div className={`text-xs ${sub}`}>{r.stops.length} stops · ₹{r.fare} · ~{r.time} min</div>
                </div>
                <span className="text-orange-400">{selected === r.number ? "▲" : "▼"}</span>
              </button>
              {selected === r.number && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1">
                    {r.stops.map((s, i) => (
                      <div key={s} className="flex items-center gap-1">
                        <span className={`text-xs px-2 py-1 rounded-lg ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>{s}</span>
                        {i < r.stops.length - 1 && <span className="text-gray-500 text-xs">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EMU TRAINS ───────────────────────────────────────────────────────────────
function EMURoutes({ theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const [selected, setSelected] = useState(null);
  return (
    <div className="min-h-screen">
      <TopBar title="EMU Trains" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={{name:"U"}} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {EMU_TRAINS.map(t => (
          <div key={t.number} className={`${card} border rounded-2xl overflow-hidden`}>
            <button onClick={() => setSelected(selected === t.number ? null : t.number)} className="w-full p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">{t.number}</span>
              </div>
              <div className="flex-1 text-left">
                <div className={`font-bold text-sm ${text}`}>{t.name}</div>
                <div className={`text-xs ${sub}`}>{t.stations.length} stations · ₹{t.fare} · ~{t.time} min</div>
              </div>
              <span className="text-green-400">{selected === t.number ? "▲" : "▼"}</span>
            </button>
            {selected === t.number && (
              <div className="px-4 pb-4 space-y-3">
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-green-500" />
                  {t.stations.map((s, i) => (
                    <div key={s} className="flex items-center gap-3 pl-6 relative py-1">
                      <div className={`absolute left-2 w-2 h-2 rounded-full ${i === 0 || i === t.stations.length - 1 ? "bg-green-500" : dark ? "bg-gray-600" : "bg-gray-300"} border-2 border-green-500`} />
                      <span className={`text-xs ${text}`}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className={`p-3 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-100"} text-xs ${sub}`}>
                  Train: {t.number} · Route: {t.route}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WALLET ───────────────────────────────────────────────────────────────────
function Wallet({ user, updateUser, notify, theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub, inp } = theme;
  const [showTopup, setShowTopup] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);

  const topup = () => {
    const amt = parseInt(amount);
    if (!amt || amt < 10 || amt > 10000) { notify("Enter amount between ₹10–₹10,000", "error"); return; }
    setProcessing(true);
    setTimeout(() => {
      updateUser({ ...user, balance: user.balance + amt });
      notify(`₹${amt} added via ${method}!`);
      setProcessing(false); setShowTopup(false); setAmount("");
    }, 2000);
  };

  const presets = [100, 200, 500, 1000];
  const methods = ["UPI", "Credit Card", "Debit Card", "Razorpay"];
  const txns = [
    { type: "topup", desc: "Wallet Top-up", amount: 500, date: "10 Jun 2025", positive: true },
    { type: "trip", desc: "Metro · Rajiv Chowk → Hauz Khas", amount: 35, date: "09 Jun 2025", positive: false },
    { type: "trip", desc: "Bus · Route AC-1", amount: 25, date: "08 Jun 2025", positive: false },
    { type: "topup", desc: "Wallet Top-up", amount: 300, date: "07 Jun 2025", positive: true },
    { type: "trip", desc: "EMU · Delhi → Faridabad", amount: 12, date: "07 Jun 2025", positive: false },
    ...user.history.slice(0, 5).map(h => ({ type: "trip", desc: `${h.mode} · ${h.from} → ${h.to}`, amount: h.fare, date: h.date, positive: false })),
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Smart Wallet" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={user} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white">
          <div className="text-sm text-blue-200 mb-1">Available Balance</div>
          <div className="text-5xl font-black mb-4">₹{user.balance}</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-200">Card ID</div>
              <div className="font-mono text-sm">{user.id}</div>
            </div>
            {user.balance < 50 && <div className="text-xs bg-red-500/40 border border-red-400/50 rounded-lg px-3 py-1.5">⚠️ Low Balance</div>}
          </div>
        </div>

        <button onClick={() => setShowTopup(true)} className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Icon name="plus" size={20} /> Add Money to Wallet
        </button>

        {/* Top-up Modal */}
        {showTopup && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
            <div className={`w-full max-w-md ${card} border rounded-2xl p-6 space-y-4`}>
              <div className={`font-bold text-lg ${text}`}>Add Money</div>
              <div className="grid grid-cols-4 gap-2">
                {presets.map(p => (
                  <button key={p} onClick={() => setAmount(String(p))}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${amount == p ? "bg-blue-600 border-blue-500 text-white" : `${dark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}`}>
                    ₹{p}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${inp}`} />
              <div className="grid grid-cols-2 gap-2">
                {methods.map(m => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${method === m ? "bg-purple-600 border-purple-500 text-white" : `${dark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}`}>
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowTopup(false)} className={`flex-1 py-3 rounded-xl border text-sm font-medium ${dark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}>Cancel</button>
                <button onClick={topup} disabled={processing} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-bold hover:opacity-90">
                  {processing ? <span className="animate-pulse">Processing…</span> : `Pay ₹${amount || 0}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div>
          <div className={`text-sm font-semibold ${sub} mb-3`}>Transaction History</div>
          <div className="space-y-2">
            {txns.map((t, i) => (
              <div key={i} className={`${card} border rounded-xl p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.positive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {t.positive ? "+" : <Icon name={t.type === "trip" ? "metro" : "wallet"} size={14} />}
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${text}`}>{t.desc}</div>
                    <div className={`text-xs ${sub}`}>{t.date}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${t.positive ? "text-green-400" : "text-red-400"}`}>
                  {t.positive ? "+" : "-"}₹{t.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRAVEL HISTORY ───────────────────────────────────────────────────────────
function TravelHistory({ user, theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const allHistory = [...user.history, ...ALL_USERS.slice(0, 20).flatMap(u => u.history.slice(0, 2).map(h => ({ ...h, isSample: true })))].slice(0, 30);
  return (
    <div className="min-h-screen">
      <TopBar title="Travel History" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={user} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className={`text-sm ${sub} mb-4`}>Showing {allHistory.length} recent trips</div>
        <div className="space-y-2">
          {allHistory.map((t, i) => (
            <div key={i} className={`${card} border rounded-xl p-4`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${t.mode === "Metro" ? "bg-blue-500/20 text-blue-400" : t.mode === "Bus" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}>
                    <Icon name={t.mode === "Metro" ? "metro" : t.mode === "Bus" ? "bus" : "train"} size={12} />
                  </div>
                  <span className={`text-xs font-semibold ${text}`}>{t.mode}</span>
                </div>
                <span className="text-red-400 text-sm font-bold">-₹{t.fare}</span>
              </div>
              <div className={`text-sm font-medium ${text}`}>{t.from} <span className={sub}>→</span> {t.to}</div>
              <div className={`text-xs ${sub} mt-1`}>{t.date} · {t.duration} min</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USER ANALYTICS ───────────────────────────────────────────────────────────
function UserAnalytics({ user, theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const COLORS = ["#3B82F6", "#F97316", "#10B981", "#8B5CF6"];
  const modeData = [
    { name: "Metro", value: user.metro, color: "#3B82F6" },
    { name: "Bus", value: user.bus, color: "#F97316" },
    { name: "EMU", value: user.emu, color: "#10B981" },
  ];
  const weekData = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({ day: d, trips: Math.floor(Math.random() * 5 + 1) }));
  const stats = [
    { label: "Total Trips", value: user.trips, icon: "history" },
    { label: "Total Spent", value: `₹${user.totalSpent}`, icon: "wallet" },
    { label: "Avg/Trip", value: `₹${user.trips ? Math.floor(user.totalSpent / user.trips) : 0}`, icon: "chart" },
    { label: "Metro Trips", value: user.metro, icon: "metro" },
    { label: "Bus Trips", value: user.bus, icon: "bus" },
    { label: "EMU Trips", value: user.emu, icon: "train" },
  ];
  return (
    <div className="min-h-screen">
      <TopBar title="My Analytics" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={user} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`${card} border rounded-2xl p-3 text-center`}>
              <div className={`text-xl font-black ${text}`}>{s.value}</div>
              <div className={`text-xs ${sub}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Monthly Spending Chart */}
        <div className={`${card} border rounded-2xl p-4`}>
          <div className={`text-sm font-semibold ${text} mb-4`}>Monthly Spending (₹)</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={user.monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <Tooltip contentStyle={{ backgroundColor: dark ? "#1F2937" : "#fff", border: "none", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mode Distribution */}
        <div className={`${card} border rounded-2xl p-4`}>
          <div className={`text-sm font-semibold ${text} mb-4`}>Transport Mode Usage</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={modeData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {modeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: dark ? "#1F2937" : "#fff", borderRadius: "12px", border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className={`${card} border rounded-2xl p-4`}>
          <div className={`text-sm font-semibold ${text} mb-4`}>Weekly Activity</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <Tooltip contentStyle={{ backgroundColor: dark ? "#1F2937" : "#fff", borderRadius: "12px", border: "none" }} />
              <Bar dataKey="trips" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function Notifications({ user, theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const notifs = [
    { icon: "💰", title: "Wallet Low Balance", msg: user.balance < 50 ? `Your balance is ₹${user.balance}. Please top up.` : "Keep your wallet topped up for seamless travel.", time: "Now", color: user.balance < 50 ? "border-l-red-500" : "border-l-green-500" },
    { icon: "🚇", title: "Metro Alert", msg: "Yellow Line: Minor delays at Rajiv Chowk due to signal maintenance. Expected to normalise by 6 PM.", time: "2h ago", color: "border-l-yellow-500" },
    { icon: "🎉", title: "Travel Milestone!", msg: `You've completed ${user.trips} trips on DSMS. Keep commuting smart!`, time: "Today", color: "border-l-blue-500" },
    { icon: "🚌", title: "Bus Route Update", msg: "Route AC-2: Diverted via Moti Nagar due to road works near Patel Nagar.", time: "3h ago", color: "border-l-orange-500" },
    { icon: "🔔", title: "Peak Hours", msg: "Avoid metro between 8–10 AM and 5–7 PM. Crowding expected on Blue & Yellow lines.", time: "Yesterday", color: "border-l-purple-500" },
    { icon: "💡", title: "Tip", msg: "Use the Route Planner to find the cheapest multi-modal route for your daily commute!", time: "2 days ago", color: "border-l-cyan-500" },
  ];
  return (
    <div className="min-h-screen">
      <TopBar title="Notifications" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={user} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {notifs.map((n, i) => (
          <div key={i} className={`${card} border rounded-xl p-4 border-l-4 ${n.color}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{n.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-semibold ${text}`}>{n.title}</div>
                <div className={`text-xs ${sub} mt-0.5`}>{n.msg}</div>
                <div className={`text-xs ${sub} mt-2`}>{n.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ user, updateUser, notify, theme, dark, toggle, navigate, setSidebarOpen }) {
  const { card, text, sub, inp } = theme;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const save = () => { updateUser({ ...user, ...form }); notify("Profile updated!"); setEditing(false); };
  return (
    <div className="min-h-screen">
      <TopBar title="My Profile" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={user} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-3">{user.name[0]}</div>
          <div className={`text-xl font-black ${text}`}>{user.name}</div>
          <div className={`text-sm ${sub}`}>{user.id}</div>
          <div className="flex items-center gap-1 mt-2 text-green-400 text-xs"><Icon name="check" size={12} /> Verified Member</div>
        </div>

        <div className={`${card} border rounded-2xl p-5 space-y-4`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm font-semibold ${text}`}>Account Details</div>
            <button onClick={() => setEditing(!editing)} className="text-xs text-blue-400 hover:text-blue-300">{editing ? "Cancel" : "Edit"}</button>
          </div>
          {[["Name", "name"], ["Email", "email"], ["Phone", "phone"]].map(([label, key]) => (
            <div key={key}>
              <div className={`text-xs ${sub} mb-1`}>{label}</div>
              {editing && key !== "email" ? (
                <input value={form[key] ?? user[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
              ) : (
                <div className={`text-sm font-medium ${text}`}>{user[key]}</div>
              )}
            </div>
          ))}
          {editing && <button onClick={save} className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold">Save Changes</button>}
        </div>

        <div className={`${card} border rounded-2xl p-5`}>
          <div className={`text-sm font-semibold ${text} mb-4`}>Travel Summary</div>
          <div className="space-y-3">
            {[["Joined", user.joined], ["Favourite Route", user.favoriteRoute], ["Total Trips", user.trips], ["Total Spent", `₹${user.totalSpent}`]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className={`text-xs ${sub}`}>{k}</span>
                <span className={`text-xs font-medium ${text}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${card} border rounded-2xl p-4 flex items-center gap-3 border-blue-500/30`}>
          <Icon name="shield" size={20} className="text-blue-400" />
          <div>
            <div className={`text-sm font-semibold ${text}`}>Security</div>
            <div className={`text-xs ${sub}`}>Face ID & Fingerprint registered</div>
          </div>
          <div className="ml-auto text-green-400 text-xs font-medium">Active</div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({ dark, toggle, theme, navigate, setSidebarOpen }) {
  const { card, text, sub } = theme;
  const [settings, setSettings] = useState({ notifications: true, lowBalance: true, travelUpdates: true, language: "English", currency: "INR" });
  const Toggle = ({ val, onChange }) => (
    <button onClick={onChange} className={`w-12 h-6 rounded-full transition-all relative ${val ? "bg-blue-600" : dark ? "bg-gray-700" : "bg-gray-300"}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${val ? "left-7" : "left-1"}`} />
    </button>
  );
  return (
    <div className="min-h-screen">
      <TopBar title="Settings" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={{name:"U"}} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className={`${card} border rounded-2xl overflow-hidden`}>
          <div className={`px-4 py-3 text-xs font-semibold ${sub} uppercase tracking-wider border-b ${dark ? "border-gray-800" : "border-gray-100"}`}>Appearance</div>
          <div className="divide-y divide-gray-800">
            {[["Dark Mode", dark, toggle], ["Notifications", settings.notifications, () => setSettings(s => ({ ...s, notifications: !s.notifications }))], ["Low Balance Alerts", settings.lowBalance, () => setSettings(s => ({ ...s, lowBalance: !s.lowBalance }))], ["Travel Updates", settings.travelUpdates, () => setSettings(s => ({ ...s, travelUpdates: !s.travelUpdates }))]].map(([label, val, fn]) => (
              <div key={label} className="flex items-center justify-between px-4 py-4">
                <span className={`text-sm ${text}`}>{label}</span>
                <Toggle val={val} onChange={fn} />
              </div>
            ))}
          </div>
        </div>

        <div className={`${card} border rounded-2xl overflow-hidden`}>
          <div className={`px-4 py-3 text-xs font-semibold ${sub} uppercase tracking-wider border-b ${dark ? "border-gray-800" : "border-gray-100"}`}>About</div>
          <div className="px-4 py-4 space-y-2">
            {[["App Version", "1.0.0"], ["Build", "DSMS-2025"], ["Developer", "Piyush Jha"], ["Stack", "React + FastAPI + PostgreSQL"]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className={`text-xs ${sub}`}>{k}</span>
                <span className={`text-xs ${text}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ theme, dark, toggle, navigate, setSidebarOpen, allUsers, registeredUsers }) {
  const { card, text, sub } = theme;
  const totalUsers = allUsers.length + registeredUsers.length;
  const totalTrips = allUsers.reduce((s, u) => s + u.trips, 0);
  const totalRevenue = allUsers.reduce((s, u) => s + u.totalSpent, 0);
  const avgBalance = Math.floor(allUsers.reduce((s, u) => s + u.balance, 0) / allUsers.length);

  const monthlyRevenue = MONTHS.map((m, i) => ({
    month: m,
    revenue: Math.floor(totalRevenue / 12 + (Math.sin(i) * 50000)),
    users: Math.floor(totalUsers / 12 + i * 15),
    trips: Math.floor(totalTrips / 12 + (Math.cos(i) * 200)),
  }));

  const modeDistribution = [
    { name: "Metro", value: Math.floor(totalTrips * 0.58), color: "#3B82F6" },
    { name: "Bus", value: Math.floor(totalTrips * 0.27), color: "#F97316" },
    { name: "EMU", value: Math.floor(totalTrips * 0.15), color: "#10B981" },
  ];

  const topStations = STATIONS_POOL.slice(0, 8).map(s => ({ station: s, trips: Math.floor(Math.random() * 5000 + 1000) })).sort((a, b) => b.trips - a.trips);

  const adminStats = [
    { label: "Total Users", value: totalUsers.toLocaleString(), icon: "user", color: "from-blue-500 to-cyan-500" },
    { label: "Total Trips", value: totalTrips.toLocaleString(), icon: "history", color: "from-purple-500 to-pink-500" },
    { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: "wallet", color: "from-green-500 to-teal-500" },
    { label: "Avg Balance", value: `₹${avgBalance}`, icon: "chart", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Admin Dashboard" dark={dark} toggle={toggle} setSidebarOpen={setSidebarOpen} navigate={navigate} user={{ name: "A" }} />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Admin Stats */}
        <div className="grid grid-cols-2 gap-3">
          {adminStats.map(s => (
            <div key={s.label} className={`${card} border rounded-2xl p-4`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                <Icon name={s.icon} size={18} className="text-white" />
              </div>
              <div className={`text-2xl font-black ${text}`}>{s.value}</div>
              <div className={`text-xs ${sub}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className={`${card} border rounded-2xl p-4`}>
          <div className={`text-sm font-semibold ${text} mb-4`}>Monthly Revenue (₹)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <Tooltip contentStyle={{ backgroundColor: dark ? "#1F2937" : "#fff", borderRadius: "12px", border: "none" }} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trips Per Month */}
        <div className={`${card} border rounded-2xl p-4`}>
          <div className={`text-sm font-semibold ${text} mb-4`}>Trips Per Month</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <Tooltip contentStyle={{ backgroundColor: dark ? "#1F2937" : "#fff", borderRadius: "12px", border: "none" }} />
              <Bar dataKey="trips" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mode Distribution */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`${card} border rounded-2xl p-4`}>
            <div className={`text-sm font-semibold ${text} mb-3`}>Mode Distribution</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={modeDistribution} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={false}>
                  {modeDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: dark ? "#1F2937" : "#fff", borderRadius: "12px", border: "none" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={`${card} border rounded-2xl p-4`}>
            <div className={`text-sm font-semibold ${text} mb-3`}>Top Stations</div>
            <div className="space-y-2">
              {topStations.slice(0, 5).map((s, i) => (
                <div key={s.station}>
                  <div className="flex justify-between mb-0.5">
                    <span className={`text-xs ${sub} truncate`}>{s.station}</span>
                    <span className={`text-xs ${text} font-medium`}>{s.trips.toLocaleString()}</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${dark ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${(s.trips / topStations[0].trips) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className={`${card} border rounded-2xl p-4`}>
          <div className={`text-sm font-semibold ${text} mb-4`}>User Growth</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <YAxis tick={{ fontSize: 10, fill: dark ? "#9CA3AF" : "#6B7280" }} />
              <Tooltip contentStyle={{ backgroundColor: dark ? "#1F2937" : "#fff", borderRadius: "12px", border: "none" }} />
              <Line type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Registered Users Table */}
        <div className={`${card} border rounded-2xl p-4`}>
          <div className={`text-sm font-semibold ${text} mb-3`}>Registered Users ({registeredUsers.length})</div>
          <div className="space-y-2">
            {registeredUsers.map(u => (
              <div key={u.id} className={`flex items-center justify-between p-3 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{u.name[0]}</div>
                                    <div>
                    <div className={`text-xs font-medium ${text}`}>{u.name} {u.isAdmin && <span className="text-purple-400 ml-1">Admin</span>}</div>
                    <div className={`text-xs ${sub}`}>{u.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${text}`}>₹{u.balance}</div>
<div className={`text-xs ${sub}`}>{u.trips} trips</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
 );
}
 