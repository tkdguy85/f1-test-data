import { useState } from "react"
import { Bar, Line, Radar } from "react-chartjs-2"
import {
  day1EngineSummary,
  day2EngineSummary,
  day3EngineSummary,
  engineColors,
} from "../data/engines"
import { baseChartOptions, radarChartOptions } from "../utils/chartConfig"

const DAY_SUMMARIES = [day1EngineSummary, day2EngineSummary, day3EngineSummary]
const DAY_LABELS = ["Day 1", "Day 2", "Day 3"]
const DAY_KEYS = ["day1EngineSummary", "day2EngineSummary", "day3EngineSummary"]

const engines = day1EngineSummary.map((e) => e.engine)

function getLaps(entry) {
  return entry?.totalLaps ?? entry?.laps ?? 0
}

function buildGroupedBarData(metric) {
  return {
    labels: engines,
    datasets: DAY_SUMMARIES.map((day, i) => ({
      label: DAY_LABELS[i],
      data: engines.map((eng) => {
        const found = day.find((d) => d.engine === eng)
        if (!found) 
          return 0
        return metric === "kilometres" ? found.kilometres : getLaps(found)
      }),
      backgroundColor: ["#ffffff33", "#ffffff55", "#ffffff99"][i],
      borderColor: ["#555565", "#888898", "#ccccdd"][i],
      borderWidth: 1,
      borderRadius: 2,
    })),
  }
}

function buildRadarData() {
  return {
    labels: engines,
    datasets: DAY_SUMMARIES.map((day, i) => ({
      label: DAY_LABELS[i],
      data: engines.map((eng) => {
        const found = day.find((d) => d.engine === eng)
        return found ? found.avgKmPerTeam : 0
      }),
      borderColor: ["#0027f1", "#f90206", "#f1aa0d"][i],
      backgroundColor: ["#0027f115", "#f9020615", "#f1aa0d15"][i],
      pointBackgroundColor: ["#0027f1", "#f90206", "#f1aa0d"][i],
      pointRadius: 4,
    })),
  }
}

function buildLineData(metric) {
  return {
    labels: DAY_LABELS,
    datasets: engines.map((eng) => {
      const color = engineColors[eng] || "#888888"
      const vals = DAY_SUMMARIES.map((day) => {
        const found = day.find((d) => d.engine === eng)
        if (!found) 
          return 0
        return metric === "kilometres" ? found.kilometres : getLaps(found)
      })
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
      }
    }),
  }
}

export default function EngineSection() {
  const [metric, setMetric] = useState("kilometres")

  const metricLabel = metric === "kilometres" ? "km" : "laps"

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
          callback: (v) => `${v} ${metricLabel}`,
        },
      },
    },
  }

  const radarOpts = {
    ...radarChartOptions,
    scales: {
      r: {
        ...radarChartOptions.scales.r,
        ticks: {
          ...radarChartOptions.scales.r.ticks,
          callback: (v) => `${v}km`,
        },
      },
    },
    plugins: {
      ...radarChartOptions.plugins,
      tooltip: {
        ...radarChartOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => `  ${ctx.dataset.label}: ${ctx.raw} km/team`,
        },
      },
    },
  }

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
          callback: (v) => `${v} ${metricLabel}`,
        },
      },
    },
  }

  return (
    <div>
      <div className="section-title">Engine Manufacturer Data</div>
      <div className="section-sub">
        Comparing 5 power unit suppliers across testing
      </div>

      <div className="day-selector">
        <button
          className={`day-btn ${metric === "kilometres" ? "active" : ""}`}
          onClick={() => setMetric("kilometres")}
        >
          Kilometres
        </button>
        <button
          className={`day-btn ${metric === "laps" ? "active" : ""}`}
          onClick={() => setMetric("laps")}
        >
          Laps
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">Output Per Day by Engine</div>
          <div style={{ height: 300 }}>
            <Bar data={buildGroupedBarData(metric)} options={barOptions} />
          </div>
        </div>
        <div className="card">
          <div className="card-title">Avg km per Customer Team</div>
          <div style={{ height: 300 }}>
            <Radar data={buildRadarData()} options={radarOpts} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Day-by-Day Output — All 5 Engines</div>
        <div style={{ height: 280 }}>
          <Line data={buildLineData(metric)} options={lineOptions} />
        </div>
      </div>

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
              const [d1, d2, d3] = DAY_SUMMARIES.map((day) =>
                day.find((d) => d.engine === eng)
              )
              const color = engineColors[eng] || "#888888";
              return (
                <tr key={eng}>
                  <td>
                    <span className="team-dot" style={{ background: color }} />
                    <strong>{eng}</strong>
                  </td>
                  <td style={{ color: "#6b6b80" }}>{d1?.teams.join(", ")}</td>
                  <td>{getLaps(d1) || "—"}</td>
                  <td>{d1?.kilometres ?? "—"}</td>
                  <td>{getLaps(d2) || "—"}</td>
                  <td>{d2?.kilometres ?? "—"}</td>
                  <td>{getLaps(d3) || "—"}</td>
                  <td>{d3?.kilometres ?? "—"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
