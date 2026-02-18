import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import { Bar, Line, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale,
  ArcElement
);

// ─── DATA ──────────────────────────────────────────────────────────────────

const teamsData = {
  teams: [
    { name: "Alpine", code: "ALP", color: "#0027f1", engine: "Mercedes-AMG F1 M17", chassis: "A526", drivers: [{ name: "Pierre Gasly", number: 10 }, { name: "Franco Colapinto", number: 43 }] },
    { name: "Aston Martin Honda", code: "AST", color: "#249046", engine: "Honda RA626H", chassis: "AMR26", drivers: [{ name: "Fernando Alonso", number: 14 }, { name: "Lance Stroll", number: 18 }] },
    { name: "Atlassian Williams", code: "WIL", color: "#0079f1", engine: "Mercedes-AMG F1 M17", chassis: "FW48", drivers: [{ name: "Carlos Sainz", number: 55 }, { name: "Alexander Albon", number: 23 }] },
    { name: "Audi Revolut", code: "AUD", color: "#b1b9bc", engine: "Audi AFR 26 Hybrid", chassis: "R26", drivers: [{ name: "Niko Hulkenberg", number: 27 }, { name: "Gabriel Bortoleto", number: 5 }] },
    { name: "Cadillac", code: "CAD", color: "#999999", engine: "Ferrari 067/6", chassis: "CA01", drivers: [{ name: "Sergio Perez", number: 11 }, { name: "Valtteri Bottas", number: 77 }] },
    { name: "Scuderia Ferrari", code: "FER", color: "#f90206", engine: "Ferrari 067/6", chassis: "SF26", drivers: [{ name: "Lewis Hamilton", number: 44 }, { name: "Charles LeClerc", number: 16 }] },
    { name: "Haas", code: "HAS", color: "#ec1e1d", engine: "Ferrari 067/6", chassis: "VF26", drivers: [{ name: "Esteban Ocon", number: 31 }, { name: "Oliver Bearman", number: 87 }] },
    { name: "McLaren", code: "MCL", color: "#f1aa0d", engine: "Mercedes-AMG F1 M17", chassis: "MCL40", drivers: [{ name: "Lando Norris", number: 1 }, { name: "Oscar Piastri", number: 81 }] },
    { name: "Mercedes", code: "MER", color: "#6cd3bf", engine: "Mercedes-AMG F1 M17", chassis: "F1W17", drivers: [{ name: "George Russell", number: 63 }, { name: "Kimi Antonelli", number: 12 }] },
    { name: "Racing Bulls", code: "VCARB", color: "#101797", engine: "Red Bull Ford DM01", chassis: "VCARB03", drivers: [{ name: "Liam Lawson", number: 30 }, { name: "Arvid Lindblad", number: 41 }] },
    { name: "Red Bull", code: "RBR", color: "#002cff", engine: "Red Bull Ford DM01", chassis: "RB22", drivers: [{ name: "Max Verstappen", number: 3 }, { name: "Isack Hadjar", number: 6 }] },
  ]
};

const runData = {
  day1RunSummary: [
    { team: "Williams", drivers: ["Carlos Sainz", "Alexander Albon"], totalLaps: 145, kilometres: 785 },
    { team: "Red Bull", drivers: ["Max Verstappen"], totalLaps: 136, kilometres: 736 },
    { team: "Ferrari", drivers: ["Lewis Hamilton", "Charles Leclerc"], totalLaps: 132, kilometres: 714 },
    { team: "Audi", drivers: ["Gabriel Bortoleto", "Niko Hulkenberg"], totalLaps: 122, kilometres: 660 },
    { team: "Haas", drivers: ["Esteban Ocon"], totalLaps: 115, kilometres: 622 },
    { team: "McLaren", drivers: ["Oscar Piastri", "Lando Norris"], totalLaps: 112, kilometres: 606 },
    { team: "Cadillac", drivers: ["Valtteri Bottas", "Sergio Perez"], totalLaps: 107, kilometres: 579 },
    { team: "Mercedes", drivers: ["George Russell", "Andrea Kimi Antonelli"], totalLaps: 86, kilometres: 465 },
    { team: "Alpine", drivers: ["Franco Colapinto", "Pierre Gasly"], totalLaps: 77, kilometres: 416 },
    { team: "Racing Bulls", drivers: ["Arvid Lindblad"], totalLaps: 75, kilometres: 406 },
    { team: "Aston Martin", drivers: ["Lance Stroll"], totalLaps: 36, kilometres: 195 },
  ],
  day2RunSummary: [
    { team: "McLaren", drivers: ["Norris"], laps: 149, kilometres: 806 },
    { team: "Ferrari", drivers: ["Leclerc"], laps: 139, kilometres: 752 },
    { team: "Racing Bulls", drivers: ["Lawson", "Lindblad"], laps: 133, kilometres: 720 },
    { team: "Williams", drivers: ["Albon", "Sainz"], laps: 131, kilometres: 709 },
    { team: "Haas", drivers: ["Bearman"], laps: 130, kilometres: 704 },
    { team: "Audi", drivers: ["Hulkenberg", "Bortoleto"], laps: 114, kilometres: 617 },
    { team: "Cadillac", drivers: ["Perez", "Bottas"], laps: 109, kilometres: 590 },
    { team: "Aston Martin", drivers: ["Alonso"], laps: 98, kilometres: 530 },
    { team: "Alpine", drivers: ["Gasly"], laps: 97, kilometres: 525 },
    { team: "Red Bull", drivers: ["Hadjar"], laps: 87, kilometres: 471 },
    { team: "Mercedes", drivers: ["Antonelli", "Russell"], laps: 57, kilometres: 309 },
  ],
  day3TeamRunningSummary: [
    { team: "McLaren", drivers: ["Oscar Piastri"], laps: 161, kilometres: 871 },
    { team: "Ferrari", drivers: ["Lewis Hamilton"], laps: 150, kilometres: 812 },
    { team: "Williams", drivers: ["Carlos Sainz", "Alexander Albon"], laps: 146, kilometres: 790 },
    { team: "Haas", drivers: ["Oliver Bearman", "Esteban Ocon"], laps: 145, kilometres: 785 },
    { team: "Alpine", drivers: ["Franco Colapinto"], laps: 144, kilometres: 779 },
    { team: "Mercedes", drivers: ["George Russell", "Andrea Kimi Antonelli"], laps: 139, kilometres: 752 },
    { team: "Red Bull", drivers: ["Max Verstappen", "Isack Hadjar"], laps: 120, kilometres: 649 },
    { team: "Racing Bulls", drivers: ["Liam Lawson"], laps: 119, kilometres: 644 },
    { team: "Audi", drivers: ["Gabriel Bortoleto", "Niko Hulkenberg"], laps: 118, kilometres: 639 },
    { team: "Cadillac", drivers: ["Valtteri Bottas", "Sergio Perez"], laps: 104, kilometres: 563 },
    { team: "Aston Martin", drivers: ["Lance Stroll"], laps: 72, kilometres: 390 },
  ],
};

const timingData = {
  day1TopTimes: [
    { position: 1, driver: "Norris", team: "McLaren", laps: 58, time: 94.669, gap: null, tires: "C2" },
    { position: 2, driver: "Verstappen", team: "Red Bull", laps: 136, time: 94.798, gap: 0.129, tires: "C3" },
    { position: 3, driver: "Leclerc", team: "Ferrari", laps: 80, time: 95.190, gap: 0.521, tires: "C3" },
    { position: 4, driver: "Ocon", team: "Haas", laps: 115, time: 95.578, gap: 0.909, tires: "C3" },
    { position: 5, driver: "Piastri", team: "McLaren", laps: 54, time: 95.602, gap: 0.933, tires: "C3" },
    { position: 6, driver: "Russell", team: "Mercedes", laps: 56, time: 96.108, gap: 1.439, tires: "C3" },
    { position: 7, driver: "Hamilton", team: "Ferrari", laps: 52, time: 96.433, gap: 1.764, tires: "C3" },
    { position: 8, driver: "Gasly", team: "Alpine", laps: 49, time: 96.765, gap: 2.096, tires: "C3" },
    { position: 9, driver: "Hulkenberg", team: "Audi", laps: 73, time: 96.861, gap: 2.192, tires: "C3" },
    { position: 10, driver: "Albon", team: "Williams", laps: 68, time: 97.437, gap: 2.768, tires: "C3" },
    { position: 11, driver: "Antonelli", team: "Mercedes", laps: 30, time: 97.629, gap: 2.960, tires: "C1" },
    { position: 12, driver: "Lindblad", team: "Racing Bulls", laps: 75, time: 97.945, gap: 3.276, tires: "C3" },
    { position: 13, driver: "Sainz", team: "Williams", laps: 77, time: 98.221, gap: 3.552, tires: "C3" },
    { position: 14, driver: "Perez", team: "Cadillac", laps: 58, time: 98.828, gap: 4.159, tires: "C2" },
    { position: 15, driver: "Bortoleto", team: "Audi", laps: 49, time: 98.871, gap: 4.202, tires: "C3" },
    { position: 16, driver: "Bottas", team: "Cadillac", laps: 49, time: 99.150, gap: 4.481, tires: "C1" },
    { position: 17, driver: "Stroll", team: "Aston Martin", laps: 36, time: 99.883, gap: 5.214, tires: "C2" },
    { position: 18, driver: "Colapinto", team: "Alpine", laps: 28, time: 100.330, gap: 5.661, tires: "C2" },
  ],
  day2TopTimes: [
    { position: 1, driver: "Leclerc", team: "Ferrari", laps: 139, time: 94.273, gap: null, tires: "C3" },
    { position: 2, driver: "Norris", team: "McLaren", laps: 149, time: 94.784, gap: 0.511, tires: "C2" },
    { position: 3, driver: "Bearman", team: "Haas", laps: 130, time: 95.394, gap: 1.121, tires: "C3" },
    { position: 4, driver: "Russell", team: "Mercedes", laps: 54, time: 95.466, gap: 1.193, tires: "C3" },
    { position: 5, driver: "Hadjar", team: "Red Bull", laps: 87, time: 95.561, gap: 1.288, tires: "C3" },
    { position: 6, driver: "Bortoleto", team: "Audi", laps: 67, time: 96.670, gap: 2.397, tires: "C3" },
    { position: 7, driver: "Gasly", team: "Alpine", laps: 97, time: 96.723, gap: 2.450, tires: "C3" },
    { position: 8, driver: "Bottas", team: "Cadillac", laps: 67, time: 96.824, gap: 2.551, tires: "C3" },
    { position: 9, driver: "Albon", team: "Williams", laps: 62, time: 97.229, gap: 2.956, tires: "C3" },
    { position: 10, driver: "Hulkenberg", team: "Audi", laps: 47, time: 97.266, gap: 2.993, tires: "C3" },
    { position: 11, driver: "Lindblad", team: "Racing Bulls", laps: 83, time: 97.470, gap: 3.197, tires: "C3" },
    { position: 12, driver: "Sainz", team: "Williams", laps: 69, time: 97.592, gap: 3.319, tires: "C3" },
    { position: 13, driver: "Lawson", team: "Racing Bulls", laps: 50, time: 98.017, gap: 3.744, tires: "C3" },
    { position: 14, driver: "Alonso", team: "Aston Martin", laps: 98, time: 98.248, gap: 3.975, tires: "C3" },
    { position: 15, driver: "Perez", team: "Cadillac", laps: 42, time: 98.653, gap: 4.380, tires: "C3" },
  ],
  day3TopTimes: [
    { position: 1, driver: "Antonelli", team: "Mercedes", laps: 61, time: 93.669, gap: null, tires: "C3" },
    { position: 2, driver: "Russell", team: "Mercedes", laps: 78, time: 93.918, gap: 0.249, tires: "C3" },
    { position: 3, driver: "Hamilton", team: "Ferrari", laps: 150, time: 94.209, gap: 0.540, tires: "C3" },
    { position: 4, driver: "Piastri", team: "McLaren", laps: 161, time: 94.549, gap: 0.880, tires: "C3" },
    { position: 5, driver: "Verstappen", team: "Red Bull", laps: 61, time: 95.341, gap: 1.672, tires: "C3" },
    { position: 6, driver: "Hadjar", team: "Red Bull", laps: 59, time: 95.610, gap: 1.941, tires: "C3" },
    { position: 7, driver: "Ocon", team: "Haas", laps: 75, time: 95.753, gap: 2.084, tires: "C3" },
    { position: 8, driver: "Colapinto", team: "Alpine", laps: 144, time: 95.806, gap: 2.137, tires: "C3" },
    { position: 9, driver: "Bearman", team: "Haas", laps: 70, time: 95.972, gap: 2.303, tires: "C3" },
    { position: 10, driver: "Hulkenberg", team: "Audi", laps: 58, time: 96.291, gap: 2.622, tires: "C3" },
    { position: 11, driver: "Albon", team: "Williams", laps: 78, time: 96.793, gap: 2.996, tires: "C3" },
    { position: 12, driver: "Lawson", team: "Racing Bulls", laps: 119, time: 96.808, gap: 3.139, tires: "C3" },
    { position: 13, driver: "Sainz", team: "Williams", laps: 68, time: 97.186, gap: 3.517, tires: "C3" },
    { position: 14, driver: "Perez", team: "Cadillac", laps: 67, time: 97.365, gap: 3.696, tires: "C3" },
    { position: 15, driver: "Bortoleto", team: "Audi", laps: 60, time: 97.536, gap: 3.867, tires: "C3" },
    { position: 16, driver: "Stroll", team: "Aston Martin", laps: 72, time: 98.165, gap: 4.496, tires: "C3" },
    { position: 17, driver: "Bottas", team: "Cadillac", laps: 37, time: 98.772, gap: 5.103, tires: "C3" },
  ],
};

const engineData = {
  day1EngineSummary: [
    { engine: "Mercedes", teams: ["Williams", "McLaren", "Mercedes", "Alpine"], totalLaps: 420, kilometres: 2273, avgKmPerTeam: 569 },
    { engine: "Ferrari", teams: ["Ferrari", "Haas", "Cadillac"], totalLaps: 354, kilometres: 1916, avgKmPerTeam: 639 },
    { engine: "Red Bull Ford", teams: ["Red Bull", "Racing Bulls"], totalLaps: 211, kilometres: 1142, avgKmPerTeam: 571 },
    { engine: "Audi", teams: ["Audi"], totalLaps: 122, kilometres: 660, avgKmPerTeam: 660 },
    { engine: "Honda", teams: ["Aston Martin"], totalLaps: 36, kilometres: 195, avgKmPerTeam: 195 },
  ],
  day2EngineSummary: [
    { engine: "Mercedes", teams: ["Williams", "McLaren", "Mercedes", "Alpine"], laps: 434, kilometres: 2349, avgKmPerTeam: 587 },
    { engine: "Ferrari", teams: ["Ferrari", "Haas", "Cadillac"], laps: 378, kilometres: 2046, avgKmPerTeam: 682 },
    { engine: "Red Bull Ford", teams: ["Red Bull", "Racing Bulls"], laps: 220, kilometres: 1191, avgKmPerTeam: 595 },
    { engine: "Audi", teams: ["Audi"], laps: 114, kilometres: 617, avgKmPerTeam: 617 },
    { engine: "Honda", teams: ["Aston Martin"], laps: 98, kilometres: 530, avgKmPerTeam: 530 },
  ],
  day3EngineSummary: [
    { engine: "Mercedes", teams: ["Williams", "McLaren", "Mercedes", "Alpine"], laps: 590, kilometres: 3193, avgKmPerTeam: 798 },
    { engine: "Ferrari", teams: ["Ferrari", "Haas", "Cadillac"], laps: 399, kilometres: 2159, avgKmPerTeam: 720 },
    { engine: "Red Bull Ford", teams: ["Red Bull", "Racing Bulls"], laps: 239, kilometres: 1294, avgKmPerTeam: 647 },
    { engine: "Audi", teams: ["Audi"], laps: 118, kilometres: 639, avgKmPerTeam: 639 },
    { engine: "Honda", teams: ["Aston Martin"], laps: 72, kilometres: 390, avgKmPerTeam: 390 },
  ],
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

const teamNameMap = {
  "Alpine": "Alpine",
  "Aston Martin": "Aston Martin Honda",
  "Williams": "Atlassian Williams",
  "Audi": "Audi Revolut",
  "Cadillac": "Cadillac",
  "Ferrari": "Scuderia Ferrari",
  "Haas": "Haas",
  "McLaren": "McLaren",
  "Mercedes": "Mercedes",
  "Racing Bulls": "Racing Bulls",
  "Red Bull": "Red Bull",
};

function getTeamColor(teamName) {
  const fullName = teamNameMap[teamName] || teamName;
  const t = teamsData.teams.find(
    (t) => t.name === fullName || t.name.toLowerCase().includes(teamName.toLowerCase())
  );
  return t ? t.color : "#888888";
}

function getTeamColorByDriver(driverLastName) {
  const dayTimings = [...timingData.day1TopTimes, ...timingData.day2TopTimes, ...timingData.day3TopTimes];
  const entry = dayTimings.find((d) => d.driver === driverLastName);
  if (!entry) return "#888888";
  return getTeamColor(entry.team);
}

function formatLapTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${mins}:${secs}`;
}

const engineColors = {
  "Mercedes": "#6cd3bf",
  "Ferrari": "#f90206",
  "Red Bull Ford": "#002cff",
  "Audi": "#b1b9bc",
  "Honda": "#249046",
};

// ─── CSS ─────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Barlow+Condensed:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #18181f;
    --border: #252530;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --accent: #e10600;
    --accent2: #ffffff;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'Barlow Condensed', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
  }

  .app {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  /* Header */
  .header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 48px 0 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 48px;
    gap: 24px;
  }
  .header-left {}
  .header-eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .header-title {
    font-family: var(--font-display);
    font-size: clamp(48px, 6vw, 88px);
    line-height: 0.9;
    color: var(--accent2);
    letter-spacing: 0.02em;
  }
  .header-title span {
    color: var(--accent);
  }
  .header-meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    text-align: right;
    line-height: 1.8;
  }

  /* Nav tabs */
  .nav {
    display: flex;
    gap: 2px;
    margin-bottom: 48px;
    background: var(--surface);
    padding: 4px;
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  .nav-tab {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: none;
    border: none;
    color: var(--muted);
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.2s;
    white-space: nowrap;
    flex: 1;
    text-align: center;
  }
  .nav-tab:hover { color: var(--text); background: var(--surface2); }
  .nav-tab.active {
    background: var(--accent);
    color: #fff;
  }

  /* Section */
  .section-title {
    font-family: var(--font-display);
    font-size: 36px;
    letter-spacing: 0.05em;
    color: var(--accent2);
    margin-bottom: 8px;
  }
  .section-sub {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  /* Chart card */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 28px;
    margin-bottom: 24px;
  }
  .card-title {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Day selector */
  .day-selector {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
  }
  .day-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 6px 14px;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.15s;
  }
  .day-btn:hover { color: var(--text); border-color: var(--muted); }
  .day-btn.active {
    background: var(--surface2);
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  @media (max-width: 900px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
  }

  /* Team bio cards */
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
  .team-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 20px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }
  .team-card:hover {
    transform: translateY(-2px);
  }
  .team-card-accent {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 3px;
  }
  .team-card.selected {
    border-color: var(--selected-color, #888);
    box-shadow: 0 0 0 1px var(--selected-color, #888);
  }
  .team-card-name {
    font-family: var(--font-display);
    font-size: 22px;
    letter-spacing: 0.05em;
    color: var(--text);
    margin-bottom: 4px;
  }
  .team-card-code {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.2em;
    margin-bottom: 16px;
  }
  .team-card-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
  }
  .team-card-label { color: var(--muted); }
  .team-card-value { color: var(--text); text-align: right; max-width: 60%; }
  .team-driver {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .driver-num {
    font-family: var(--font-display);
    font-size: 18px;
    width: 32px;
    text-align: center;
    line-height: 1;
  }
  .driver-name {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  /* Team detail panel */
  .team-detail {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 32px;
    margin-top: 24px;
    position: relative;
    overflow: hidden;
  }
  .team-detail-bg {
    position: absolute;
    top: -60px; right: -40px;
    font-family: var(--font-display);
    font-size: 180px;
    opacity: 0.04;
    color: var(--text);
    pointer-events: none;
    line-height: 1;
  }
  .team-detail-name {
    font-family: var(--font-display);
    font-size: 48px;
    color: var(--text);
    margin-bottom: 4px;
    letter-spacing: 0.03em;
  }
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 24px;
  }
  .detail-block {}
  .detail-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .detail-value {
    font-family: var(--font-body);
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }
  .drivers-list {
    margin-top: 20px;
  }
  .driver-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .driver-card-num {
    font-family: var(--font-display);
    font-size: 36px;
    line-height: 1;
    min-width: 48px;
  }
  .driver-card-name {
    font-family: var(--font-body);
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
  }

  /* Timing table */
  .timing-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .timing-table th {
    text-align: left;
    padding: 8px 12px;
    color: var(--muted);
    letter-spacing: 0.1em;
    font-size: 10px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  .timing-table td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }
  .timing-table tr:hover td { background: var(--surface2); }
  .timing-table .pos { color: var(--muted); width: 30px; }
  .timing-table .driver-name-cell { font-weight: 500; font-family: var(--font-body); font-size: 14px; }
  .timing-table .team-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
  }
  .timing-table .time-val { font-weight: 500; letter-spacing: 0.05em; }
  .timing-table .gap-val { color: var(--muted); }
  .tire-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 9px;
    letter-spacing: 0.1em;
    font-weight: 500;
  }
  .tire-C1 { background: #fff; color: #000; }
  .tire-C2 { background: #f0e500; color: #000; }
  .tire-C3 { background: #ff3c3c; color: #fff; }
  .tire-C4 { background: #c0c0c0; color: #000; }
  .tire-C5 { background: #ff9900; color: #000; }

  .note-banner {
    background: var(--surface2);
    border-left: 3px solid var(--accent);
    padding: 10px 16px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 24px;
    border-radius: 0 4px 4px 0;
  }
`;

// ─── CHART OPTIONS ────────────────────────────────────────────────────────────

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#6b6b80",
        font: { family: "DM Mono", size: 11 },
        boxWidth: 12,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "#18181f",
      borderColor: "#252530",
      borderWidth: 1,
      titleColor: "#e8e8f0",
      bodyColor: "#6b6b80",
      titleFont: { family: "Barlow Condensed", size: 14, weight: "600" },
      bodyFont: { family: "DM Mono", size: 11 },
      padding: 12,
    },
  },
  scales: {
    x: {
      ticks: { color: "#6b6b80", font: { family: "DM Mono", size: 11 } },
      grid: { color: "#1e1e28" },
      border: { color: "#252530" },
    },
    y: {
      ticks: { color: "#6b6b80", font: { family: "DM Mono", size: 11 } },
      grid: { color: "#1e1e28" },
      border: { color: "#252530" },
    },
  },
};

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function LapTimesSection() {
  const [day, setDay] = useState("day1");

  const dayKey = `${day}TopTimes`;
  const times = timingData[dayKey] || [];

  // Bar chart: lap times by driver
  const validTimes = times.filter((t) => t.time != null);
  const sorted = [...validTimes].sort((a, b) => a.time - b.time);

  const barData = {
    labels: sorted.map((d) => d.driver),
    datasets: [
      {
        label: "Best Lap Time (s)",
        data: sorted.map((d) => d.time),
        backgroundColor: sorted.map((d) => getTeamColor(d.team) + "cc"),
        borderColor: sorted.map((d) => getTeamColor(d.team)),
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const minTime = Math.min(...sorted.map((d) => d.time));

  const barOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: { display: false },
      tooltip: {
        ...baseChartOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => `  ${formatLapTime(ctx.raw)}  (${ctx.raw.toFixed(3)}s)`,
        },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        min: Math.floor(minTime - 1),
        ticks: {
          ...baseChartOptions.scales.y.ticks,
          callback: (v) => `${v}s`,
        },
      },
    },
  };

  // Line chart: gap to leader
  const gapData = {
    labels: sorted.map((d) => d.driver),
    datasets: [
      {
        label: "Gap to Leader (s)",
        data: sorted.map((d) => (d.gap ?? 0)),
        borderColor: "#e10600",
        backgroundColor: "#e1060020",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: sorted.map((d) => getTeamColor(d.team)),
        pointBorderColor: "#0a0a0f",
        pointRadius: 5,
        pointBorderWidth: 2,
      },
    ],
  };

  const gapOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: { display: false },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        ticks: { ...baseChartOptions.scales.y.ticks, callback: (v) => `+${v.toFixed(2)}s` },
      },
    },
  };

  return (
    <div>
      <div className="section-title">Lap Time Comparison</div>
      <div className="section-sub">Best times by driver — Bahrain International Circuit</div>

      <div className="day-selector">
        {["day1", "day2", "day3"].map((d) => (
          <button key={d} className={`day-btn ${day === d ? "active" : ""}`} onClick={() => setDay(d)}>
            {d === "day1" ? "Day 1" : d === "day2" ? "Day 2" : "Day 3"}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Best Lap Times — Sorted Fastest to Slowest</div>
        <div style={{ height: 320 }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Gap to Leader</div>
        <div style={{ height: 260 }}>
          <Line data={gapData} options={gapOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Full Timing Sheet</div>
        <table className="timing-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Driver</th>
              <th>Team</th>
              <th>Laps</th>
              <th>Best Time</th>
              <th>Gap</th>
              <th>Tyre</th>
            </tr>
          </thead>
          <tbody>
            {times.map((row) => (
              <tr key={row.position}>
                <td className="pos">{row.position}</td>
                <td className="driver-name-cell">
                  <span className="team-dot" style={{ background: getTeamColor(row.team) }} />
                  {row.driver}
                </td>
                <td>{row.team}</td>
                <td>{row.laps}</td>
                <td className="time-val">{row.time ? formatLapTime(row.time) : "—"}</td>
                <td className="gap-val">{row.gap != null ? `+${row.gap.toFixed(3)}` : "—"}</td>
                <td>
                  {row.tires && <span className={`tire-badge tire-${row.tires}`}>{row.tires}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross-day comparison: best time per driver across all days */}
      <CrossDayComparison />
    </div>
  );
}

function CrossDayComparison() {
  const allDrivers = {};
  ["day1TopTimes", "day2TopTimes", "day3TopTimes"].forEach((dayKey, idx) => {
    timingData[dayKey].forEach((entry) => {
      if (!entry.time) return;
      if (!allDrivers[entry.driver]) {
        allDrivers[entry.driver] = { team: entry.team, times: [null, null, null] };
      }
      allDrivers[entry.driver].times[idx] = entry.time;
    });
  });

  // Find drivers with times on all 3 days
  const multiDayDrivers = Object.entries(allDrivers)
    .filter(([, v]) => v.times.filter(Boolean).length >= 2)
    .sort((a, b) => {
      const aMin = Math.min(...a[1].times.filter(Boolean));
      const bMin = Math.min(...b[1].times.filter(Boolean));
      return aMin - bMin;
    })
    .slice(0, 12);

  const lineData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: multiDayDrivers.map(([driver, { team, times }]) => ({
      label: driver,
      data: times,
      borderColor: getTeamColor(team),
      backgroundColor: getTeamColor(team) + "33",
      tension: 0.2,
      pointBackgroundColor: getTeamColor(team),
      pointRadius: 4,
      spanGaps: true,
    })),
  };

  const minAll = Math.min(...multiDayDrivers.flatMap(([, v]) => v.times.filter(Boolean)));

  const options = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      tooltip: {
        ...baseChartOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => ctx.raw != null ? `  ${ctx.dataset.label}: ${formatLapTime(ctx.raw)}` : null,
        },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        min: Math.floor(minAll - 0.5),
        ticks: { ...baseChartOptions.scales.y.ticks, callback: (v) => `${v}s` },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-title">Driver Progression Across 3 Days (Top 12)</div>
      <div style={{ height: 340 }}>
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
}

function EngineSection() {
  const [metric, setMetric] = useState("kilometres");

  const engines = engineData.day1EngineSummary.map((e) => e.engine);
  const days = ["day1EngineSummary", "day2EngineSummary", "day3EngineSummary"];
  const dayLabels = ["Day 1", "Day 2", "Day 3"];

  const barGroupedData = {
    labels: engines,
    datasets: days.map((dayKey, i) => {
      const day = engineData[dayKey];
      return {
        label: dayLabels[i],
        data: engines.map((eng) => {
          const found = day.find((d) => d.engine === eng);
          if (!found) return 0;
          if (metric === "kilometres") return found.kilometres;
          const laps = found.totalLaps ?? found.laps;
          return laps;
        }),
        backgroundColor: ["#ffffff33", "#ffffff55", "#ffffff99"][i],
        borderColor: ["#555565", "#888898", "#ccccdd"][i],
        borderWidth: 1,
        borderRadius: 2,
      };
    }),
  };

  const barOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: {
        ...baseChartOptions.plugins.legend,
        labels: { ...baseChartOptions.plugins.legend.labels, color: "#aaaabc" },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        ticks: {
          ...baseChartOptions.scales.y.ticks,
          callback: (v) => metric === "kilometres" ? `${v} km` : `${v} laps`,
        },
      },
    },
  };

  // Avg km per team per day — radar
  const radarData = {
    labels: engines,
    datasets: days.map((dayKey, i) => {
      const day = engineData[dayKey];
      return {
        label: dayLabels[i],
        data: engines.map((eng) => {
          const found = day.find((d) => d.engine === eng);
          return found ? found.avgKmPerTeam : 0;
        }),
        borderColor: ["#0027f1", "#f90206", "#f1aa0d"][i],
        backgroundColor: ["#0027f115", "#f9020615", "#f1aa0d15"][i],
        pointBackgroundColor: ["#0027f1", "#f90206", "#f1aa0d"][i],
        pointRadius: 4,
      };
    }),
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        ticks: { color: "#6b6b80", font: { family: "DM Mono", size: 10 }, backdropColor: "transparent", callback: (v) => `${v}km` },
        grid: { color: "#252530" },
        pointLabels: { color: "#aaaabc", font: { family: "Barlow Condensed", size: 12, weight: "600" } },
        angleLines: { color: "#252530" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#aaaabc", font: { family: "DM Mono", size: 11 }, boxWidth: 12 },
      },
      tooltip: {
        backgroundColor: "#18181f",
        borderColor: "#252530",
        borderWidth: 1,
        titleColor: "#e8e8f0",
        bodyColor: "#6b6b80",
        titleFont: { family: "Barlow Condensed", size: 14, weight: "600" },
        bodyFont: { family: "DM Mono", size: 11 },
        padding: 12,
        callbacks: { label: (ctx) => `  ${ctx.dataset.label}: ${ctx.raw} km/team` },
      },
    },
  };

  // Cumulative totals line
  const cumulativeData = {
    labels: dayLabels,
    datasets: engines.map((eng) => {
      const color = engineColors[eng] || "#888888";
      const vals = days.map((dayKey) => {
        const found = engineData[dayKey].find((d) => d.engine === eng);
        if (!found) return 0;
        return metric === "kilometres" ? found.kilometres : (found.totalLaps ?? found.laps);
      });
      return {
        label: eng,
        data: vals,
        borderColor: color,
        backgroundColor: color + "22",
        tension: 0.3,
        fill: false,
        pointBackgroundColor: color,
        pointRadius: 5,
        pointBorderColor: "#0a0a0f",
        pointBorderWidth: 2,
      };
    }),
  };

  const lineOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: {
        ...baseChartOptions.plugins.legend,
        labels: { ...baseChartOptions.plugins.legend.labels, color: "#aaaabc" },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        ticks: {
          ...baseChartOptions.scales.y.ticks,
          callback: (v) => metric === "kilometres" ? `${v} km` : `${v} laps`,
        },
      },
    },
  };

  return (
    <div>
      <div className="section-title">Engine Manufacturer Data</div>
      <div className="section-sub">Comparing 5 power unit suppliers across testing</div>

      <div className="day-selector">
        <button className={`day-btn ${metric === "kilometres" ? "active" : ""}`} onClick={() => setMetric("kilometres")}>Kilometres</button>
        <button className={`day-btn ${metric === "laps" ? "active" : ""}`} onClick={() => setMetric("laps")}>Laps</button>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">Output Per Day by Engine</div>
          <div style={{ height: 300 }}>
            <Bar data={barGroupedData} options={barOptions} />
          </div>
        </div>
        <div className="card">
          <div className="card-title">Avg km per Customer Team — Radar</div>
          <div style={{ height: 300 }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Day-by-Day Output — All 5 Engines</div>
        <div style={{ height: 280 }}>
          <Line data={cumulativeData} options={lineOptions} />
        </div>
      </div>

      {/* Engine summary table */}
      <div className="card">
        <div className="card-title">Engine Summary Table</div>
        <table className="timing-table">
          <thead>
            <tr>
              <th>Engine</th>
              <th>Teams</th>
              <th>Day 1 Laps</th>
              <th>Day 1 km</th>
              <th>Day 2 Laps</th>
              <th>Day 2 km</th>
              <th>Day 3 Laps</th>
              <th>Day 3 km</th>
            </tr>
          </thead>
          <tbody>
            {engines.map((eng) => {
              const d1 = engineData.day1EngineSummary.find((d) => d.engine === eng);
              const d2 = engineData.day2EngineSummary.find((d) => d.engine === eng);
              const d3 = engineData.day3EngineSummary.find((d) => d.engine === eng);
              const color = engineColors[eng] || "#888888";
              return (
                <tr key={eng}>
                  <td>
                    <span className="team-dot" style={{ background: color }} />
                    <span style={{ fontWeight: 600 }}>{eng}</span>
                  </td>
                  <td style={{ color: "#6b6b80" }}>{d1?.teams.join(", ")}</td>
                  <td>{d1?.totalLaps ?? "—"}</td>
                  <td>{d1?.kilometres ?? "—"}</td>
                  <td>{d2?.laps ?? "—"}</td>
                  <td>{d2?.kilometres ?? "—"}</td>
                  <td>{d3?.laps ?? "—"}</td>
                  <td>{d3?.kilometres ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamRunSection() {
  const [metric, setMetric] = useState("km");

  const allTeams = ["Williams", "Red Bull", "Ferrari", "Audi", "Haas", "McLaren", "Cadillac", "Mercedes", "Alpine", "Racing Bulls", "Aston Martin"];

  function getDayLaps(dayKey, teamName) {
    const day = runData[dayKey];
    const found = day.find((d) => d.team === teamName);
    if (!found) return null;
    return metric === "km" ? found.kilometres : (found.totalLaps ?? found.laps);
  }

  const teamColors = allTeams.map((t) => getTeamColor(t));

  const days = [
    { key: "day1RunSummary", label: "Day 1" },
    { key: "day2RunSummary", label: "Day 2" },
    { key: "day3TeamRunningSummary", label: "Day 3" },
  ];

  const groupedBar = {
    labels: allTeams.map((t) => {
      const full = teamNameMap[t] || t;
      const team = teamsData.teams.find((tm) => tm.name === full || tm.name.toLowerCase().includes(t.toLowerCase()));
      return team ? team.code : t;
    }),
    datasets: days.map((day, i) => ({
      label: day.label,
      data: allTeams.map((t) => getDayLaps(day.key, t) ?? 0),
      backgroundColor: teamColors.map((c) => c + ["88", "bb", "ff"][i]),
      borderColor: teamColors.map((c) => c),
      borderWidth: 1,
      borderRadius: 2,
    })),
  };

  const groupedOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: {
        ...baseChartOptions.plugins.legend,
        labels: { ...baseChartOptions.plugins.legend.labels, color: "#aaaabc" },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        ticks: { ...baseChartOptions.scales.y.ticks, callback: (v) => metric === "km" ? `${v}km` : `${v}` },
      },
    },
  };

  // Stacked bar — cumulative totals
  const totalData = {
    labels: allTeams.map((t) => {
      const full = teamNameMap[t] || t;
      const team = teamsData.teams.find((tm) => tm.name === full || tm.name.toLowerCase().includes(t.toLowerCase()));
      return team ? team.code : t;
    }),
    datasets: days.map((day, i) => ({
      label: day.label,
      data: allTeams.map((t) => getDayLaps(day.key, t) ?? 0),
      backgroundColor: teamColors.map((c) => c + ["55", "88", "cc"][i]),
      borderColor: teamColors.map((c) => c + "44"),
      borderWidth: 1,
    })),
  };

  const stackedOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: {
        ...baseChartOptions.plugins.legend,
        labels: { ...baseChartOptions.plugins.legend.labels, color: "#aaaabc" },
      },
      tooltip: {
        ...baseChartOptions.plugins.tooltip,
        callbacks: {
          footer: (items) => {
            const sum = items.reduce((acc, i) => acc + i.raw, 0);
            return `Total: ${sum.toFixed(0)} ${metric === "km" ? "km" : "laps"}`;
          },
        },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      x: { ...baseChartOptions.scales.x, stacked: true },
      y: {
        ...baseChartOptions.scales.y,
        stacked: true,
        ticks: { ...baseChartOptions.scales.y.ticks, callback: (v) => metric === "km" ? `${v}km` : `${v}` },
      },
    },
  };

  // Line — per-team across 3 days
  const lineData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: allTeams.map((t, i) => ({
      label: t,
      data: days.map((day) => getDayLaps(day.key, t) ?? null),
      borderColor: teamColors[i],
      backgroundColor: teamColors[i] + "22",
      tension: 0.2,
      pointBackgroundColor: teamColors[i],
      pointRadius: 4,
      pointBorderColor: "#0a0a0f",
      pointBorderWidth: 2,
      spanGaps: true,
    })),
  };

  const lineOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: {
        ...baseChartOptions.plugins.legend,
        labels: { ...baseChartOptions.plugins.legend.labels, color: "#aaaabc" },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        ticks: { ...baseChartOptions.scales.y.ticks, callback: (v) => metric === "km" ? `${v}km` : `${v}` },
      },
    },
  };

  return (
    <div>
      <div className="section-title">Team Run Data</div>
      <div className="section-sub">Mileage and lap counts across all 3 testing days</div>

      <div className="day-selector">
        <button className={`day-btn ${metric === "km" ? "active" : ""}`} onClick={() => setMetric("km")}>Kilometres</button>
        <button className={`day-btn ${metric === "laps" ? "active" : ""}`} onClick={() => setMetric("laps")}>Laps</button>
      </div>

      <div className="card">
        <div className="card-title">Daily Output Per Team</div>
        <div style={{ height: 320 }}>
          <Bar data={groupedBar} options={groupedOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Cumulative 3-Day Totals (Stacked)</div>
        <div style={{ height: 300 }}>
          <Bar data={totalData} options={stackedOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Day-by-Day Progression Per Team</div>
        <div style={{ height: 300 }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}

function TeamsSection() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (team) => {
    setSelected((prev) => (prev?.name === team.name ? null : team));
  };

  return (
    <div>
      <div className="section-title">Team Directory</div>
      <div className="section-sub">Click a team to view chassis details and driver lineup</div>

      <div className="team-grid">
        {teamsData.teams.map((team) => (
          <div
            key={team.name}
            className={`team-card ${selected?.name === team.name ? "selected" : ""}`}
            style={{ "--selected-color": team.color }}
            onClick={() => handleSelect(team)}
          >
            <div className="team-card-accent" style={{ background: team.color }} />
            <div className="team-card-name">{team.name}</div>
            <div className="team-card-code">{team.code}</div>
            <div style={{ borderTop: "1px solid #252530", paddingTop: 12 }}>
              {team.drivers.map((d) => (
                <div className="team-driver" key={d.number}>
                  <div className="driver-num" style={{ color: team.color }}>#{d.number}</div>
                  <div className="driver-name">{d.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="team-detail">
          <div className="team-detail-bg">{selected.code}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 4,
                height: 56,
                background: selected.color,
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <div>
              <div className="team-detail-name">{selected.name}</div>
              <div style={{ fontFamily: "DM Mono", fontSize: 11, color: "#6b6b80", letterSpacing: "0.2em" }}>
                {selected.code}
              </div>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-block">
              <div className="detail-label">Chassis</div>
              <div className="detail-value" style={{ fontFamily: "Bebas Neue", fontSize: 28, letterSpacing: "0.1em" }}>
                {selected.chassis}
              </div>
            </div>
            <div className="detail-block">
              <div className="detail-label">Power Unit</div>
              <div className="detail-value" style={{ fontSize: 15 }}>{selected.engine}</div>
            </div>
          </div>

          <div className="drivers-list">
            <div className="detail-label" style={{ marginTop: 24, marginBottom: 12 }}>Driver Lineup</div>
            {selected.drivers.map((d) => (
              <div className="driver-card" key={d.number}>
                <div className="driver-card-num" style={{ color: selected.color }}>{d.number}</div>
                <div className="driver-card-name">{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("times");

  const tabs = [
    { id: "times", label: "Lap Times" },
    { id: "engines", label: "Engine Data" },
    { id: "runs", label: "Team Runs" },
    { id: "teams", label: "Team Directory" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <div className="header-eyebrow">2026 Formula 1 Season</div>
            <div className="header-title">
              PRE-SEASON<br />
              <span>TESTING</span>
            </div>
          </div>
          <div className="header-meta">
            <div>Bahrain International Circuit</div>
            <div>Feb 26 — Feb 28, 2026</div>
            <div style={{ marginTop: 4, color: "#e10600" }}>DATA VISUALIZATION</div>
          </div>
        </header>

        <nav className="nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`nav-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="note-banner">
          ⚠ Note: Tire compound data for Antonelli on Day 1 listed as C1 (30 laps). Day 2 Antonelli timing entry has no time recorded — likely due to session issues. Data presented as-supplied; no values have been modified.
        </div>

        {tab === "times" && <LapTimesSection />}
        {tab === "engines" && <EngineSection />}
        {tab === "runs" && <TeamRunSection />}
        {tab === "teams" && <TeamsSection />}
      </div>
    </>
  );
}