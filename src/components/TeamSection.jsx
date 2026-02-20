import { useState } from "react"
import teams from "../data/teamData"
import "../styles/teams.css"

function TeamCard({ team, isSelected, onSelect }) {
  return (
    <div
      className={`team-card ${isSelected ? "selected" : ""}`}
      style={{ "--selected-color": team.color }}
      onClick={() => onSelect(team)}
    >
      <div className="team-card-accent" style={{ background: team.color }} />
      <div className="team-card-name">{team.name}</div>
      <div className="team-card-code">{team.code}</div>
      <div className="team-card-divider">
        {team.drivers.map((d) => (
          <div className="team-driver" key={d.number}>
            <div className="driver-num" style={{ color: team.color }}>
              #{d.number}
            </div>
            <div className="driver-name">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamDetail({ team }) {
  return (
    <div className="team-detail">
      <div className="team-detail-bg">{team.code}</div>

      <div className="team-detail-header">
        <div
          className="team-detail-bar"
          style={{ background: team.color }}
        />
        <div>
          <div className="team-detail-name">{team.name}</div>
          <div className="team-detail-code">{team.code}</div>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <div className="detail-label">Chassis</div>
          <div className="detail-value-chassis">{team.chassis}</div>
        </div>
        <div>
          <div className="detail-label">Power Unit</div>
          <div className="detail-value">{team.engine}</div>
        </div>
      </div>

      <div className="drivers-list">
        <div className="drivers-list-label">Driver Lineup</div>
        {team.drivers.map((d) => (
          <div className="driver-card" key={d.number}>
            <div className="driver-card-num" style={{ color: team.color }}>
              {d.number}
            </div>
            <div className="driver-card-name">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TeamsSection() {
  const [selected, setSelected] = useState(null)

  const handleSelect = (team) => {
    setSelected((prev) => (prev?.name === team.name ? null : team))
  }

  return (
    <div>
      <div className="section-title">Team Directory</div>
      <div className="section-sub">
        Click a team to view chassis details and driver lineup
      </div>

      <div className="team-grid">
        {teams.map((team) => (
          <TeamCard
            key={team.name}
            team={team}
            isSelected={selected?.name === team.name}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {selected && <TeamDetail team={selected} />}
    </div>
  )
}
