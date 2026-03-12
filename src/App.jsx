import { useState } from "react"
import "./utils/chartConfig" // registers Chart.js globally
import "./styles/global.css"

import Header from "./components/Header"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import LapTimesSection from "./components/LapTimesSection"
import EngineSection from "./components/EngineSection"
import TeamRunSection from "./components/TeamRunSection"
import TeamsSection from "./components/TeamSection"

const NOTE =
  "⚠ Note: Antonelli's Day 1 time was set on C1 tyres (30 laps). " +
  "Day 2 Antonelli entry has no time recorded — likely a session/incident issue. " +
  "Data presented as-supplied; no values have been modified."

export default function App() {
  const [tab, setTab] = useState("times");

  return (
    <div className="app">
      <Header />
      <Nav active={tab} onChange={setTab} />
      {tab === "times" && <p className="note-banner">{NOTE}</p>}

      {tab === "times" && <LapTimesSection />}
      {tab === "engines" && <EngineSection />}
      {tab === "runs" && <TeamRunSection />}
      {tab === "teams" && <TeamsSection />}
      <Footer />
    </div>
  );
}
