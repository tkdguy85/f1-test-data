import { getTeamColor, formatLapTime } from "../utils/helpers";

export default function TimingTable({ times }) {
  return (
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
              <span
                className="team-dot"
                style={{ background: getTeamColor(row.team) }}
              />
              {row.driver}
            </td>
            <td>{row.team}</td>
            <td>{row.laps}</td>
            <td className="time-val">{formatLapTime(row.time)}</td>
            <td className="gap-val">
              {row.gap != null ? `+${row.gap.toFixed(3)}` : "—"}
            </td>
            <td>
              {row.tires && (
                <span className={`tire-badge tire-${row.tires}`}>
                  {row.tires}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
