import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import { day1RunSummary, day2RunSummary, day3RunSummary } from "../data/runSummary"
import { getTeamColor, getTeamCode } from "../utils/helpers"
import { baseChartOptions } from "../utils/chartConfig"

const ALL_TEAMS = [
  "Williams", "Red Bull", "Ferrari", "Audi", "Haas",
  "McLaren", "Cadillac", "Mercedes", "Alpine", "Racing Bulls", "Aston Martin",
]

const DAYS = [
  { data: day1RunSummary, label: "Day 1" },
  { data: day2RunSummary, label: "Day 2" },
  { data: day3RunSummary, label: "Day 3" },
]

function getTeamValue(dayData, teamName, metric) {
  const found = dayData.find((d) => d.team === teamName)
  if (!found) return null
  return metric === "km" ? found.kilometres : (found.totalLaps ?? found.laps)
}

const teamColors = ALL_TEAMS.map((t) => getTeamColor(t))
const teamCodes  = ALL_TEAMS.map((t) => getTeamCode(t))

function buildGroupedBarData(metric) {
  return {
    labels: teamCodes,
    datasets: DAYS.map((day, i) => ({
      label: day.label,
      data: ALL_TEAMS.map((t) => getTeamValue(day.data, t, metric) ?? 0),
      backgroundColor: teamColors.map((c) => c + ["88", "bb", "ff"][i]),
      borderColor: teamColors,
      borderWidth: 1,
      borderRadius: 2,
    })),
  }
}

function buildStackedBarData(metric) {
  return {
    labels: teamCodes,
    datasets: DAYS.map((day, i) => ({
      label: day.label,
      data: ALL_TEAMS.map((t) => getTeamValue(day.data, t, metric) ?? 0),
      backgroundColor: teamColors.map((c) => c + ["55", "88", "cc"][i]),
      borderColor: teamColors.map((c) => c + "44"),
      borderWidth: 1,
    })),
  }
}

function buildLineData(metric) {
  return {
    labels: DAYS.map((d) => d.label),
    datasets: ALL_TEAMS.map((t, i) => ({
      label: t,
      data: DAYS.map((day) => getTeamValue(day.data, t, metric)),
      borderColor: teamColors[i],
      backgroundColor: teamColors[i] + "22",
      tension: 0.2,
      pointBackgroundColor: teamColors[i],
      pointRadius: 4,
      pointBorderColor: "#0a0a0f",
      pointBorderWidth: 2,
      spanGaps: true,
    })),
  }
}

export default function TeamRunSection() {
  const [metric, setMetric] = useState("km")

  const metricLabel = metric === "km" ? "km" : "laps"

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
        ticks: {
          ...baseChartOptions.scales.y.ticks,
          callback: (v) => `${v}${metricLabel}`,
        },
      },
    },
  }

  const stackedOptions = {
    ...groupedOptions,
    plugins: {
      ...groupedOptions.plugins,
      tooltip: {
        ...groupedOptions.plugins.tooltip,
        callbacks: {
          footer: (items) => {
            const sum = items.reduce((acc, i) => acc + i.raw, 0)
            return `Total: ${sum.toFixed(0)} ${metricLabel}`
          },
        },
      },
    },
    scales: {
      ...groupedOptions.scales,
      x: { ...groupedOptions.scales.x, stacked: true },
      y: { ...groupedOptions.scales.y, stacked: true },
    },
  }

  const lineOptions = { ...groupedOptions }

  return (
    <div>
      <div className="section-title">Team Run Data</div>
      <div className="section-sub">
        Mileage and lap counts across all 3 testing days
      </div>

      <div className="day-selector">
        <button
          className={`day-btn ${metric === "km" ? "active" : ""}`}
          onClick={() => setMetric("km")}
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

      <div className="card">
        <div className="card-title">Daily Output Per Team</div>
        <div style={{ height: 320 }}>
          <Bar data={buildGroupedBarData(metric)} options={groupedOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Cumulative 3-Day Totals (Stacked)</div>
        <div style={{ height: 300 }}>
          <Bar data={buildStackedBarData(metric)} options={stackedOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Day-by-Day Progression Per Team</div>
        <div style={{ height: 300 }}>
          <Line data={buildLineData(metric)} options={lineOptions} />
        </div>
      </div>
    </div>
  )
}
