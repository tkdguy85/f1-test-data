const TABS = [
  { id: "laps",   label: "Lap Times" },
  { id: "engines", label: "Engine Data" },
  { id: "runs",    label: "Team Runs" },
  { id: "teams",   label: "Team Directory" },
]

export default function Nav({ active, onChange }) {
  return (
    <nav className="nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
