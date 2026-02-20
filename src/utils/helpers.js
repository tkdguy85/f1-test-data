import teams from "../data/teamData"

// Map short team names (used in timing/run data) to full team names (used in teams.js)
export const teamNameMap = {
  "Alpine":        "Alpine",
  "Aston Martin":  "Aston Martin Honda",
  "Williams":      "Atlassian Williams",
  "Audi":          "Audi Revolut",
  "Cadillac":      "Cadillac",
  "Ferrari":       "Scuderia Ferrari",
  "Haas":          "Haas",
  "McLaren":       "McLaren",
  "Mercedes":      "Mercedes",
  "Racing Bulls":  "Racing Bulls",
  "Red Bull":      "Red Bull",
}


// Returns the hex color string for a given short team name.
export function getTeamColor(teamName) {
  const fullName = teamNameMap[teamName] || teamName
  const team = teams.find(
    (t) => t.name === fullName || t.name.toLowerCase().includes(teamName.toLowerCase())
  )
  return team ? team.color : "#888888"
}

// Formats a lap time in seconds to M:SS.mmm string.
export function formatLapTime(seconds) {
  if (seconds == null) return "—"
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(3).padStart(6, "0")
  return `${mins}:${secs}`
}

// Returns the team code for a given short team name.
export function getTeamCode(teamName) {
  const fullName = teamNameMap[teamName] || teamName
  const team = teams.find(
    (t) => t.name === fullName || t.name.toLowerCase().includes(teamName.toLowerCase())
  )
  return team ? team.code : teamName
}