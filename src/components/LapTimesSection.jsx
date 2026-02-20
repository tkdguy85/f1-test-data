import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import { day1TopTimes, day2TopTimes, day3TopTimes } from "../data/topLapTimes"
import { getTeamColor, formatLapTime } from "../utils/helpers"
import { baseChartOptions } from "../utils/chartConfig"
import TimingTable from "./TimingTable"

const DAY_MAP = {
  day1: day1TopTimes,
  day2: day2TopTimes,
  day3: day3TopTimes,
}

function buildBarData(sorted) {
  return {
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
  }
}

function buildGapData(sorted) {
  return {
    labels: sorted.map((d) => d.driver),
    datasets: [
      {
        label: "Gap to Leader (s)",
        data: sorted.map((d) => d.gap ?? 0),
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
  }
}

function buildCrossDayData() {
  const allDrivers = {}
  const dayArrays = [day1TopTimes, day2TopTimes, day3TopTimes]
  dayArrays.forEach((dayArr, idx) => {
    dayArr.forEach((entry) => {
      if (!entry.time) return 
      if (!allDrivers[entry.driver]) {
        allDrivers[entry.driver] = { team: entry.team, times: [null, null, null] }
      }
      allDrivers[entry.driver].times[idx] = entry.time
    })
  })

  const multiDay = Object.entries(allDrivers)
    .filter(([, v]) => v.times.filter(Boolean).length >= 2)
    .sort((a, b) => {
      const aMin = Math.min(...a[1].times.filter(Boolean))
      const bMin = Math.min(...b[1].times.filter(Boolean))
      return aMin - bMin
    })
    .slice(0, 12)

  return {
    labels: ["DAY 1", "DAY 2", "DAY 3"],
    datasets: multiDay.map(([driver, { team, times }]) => ({
      label: driver,
      data: times,
      borderColor: getTeamColor(team),
      backgroundColor: getTeamColor(team) + "33",
      tension: 0.2,
      pointBackgroundColor: getTeamColor(team),
      pointRadius: 4,
      pointBorderColor: "#0a0a0f",
      pointBorderWidth: 2,
      spanGaps: true,
    })),
  }
}

export default function LapTimesSection() {
  const [day, setDay] = useState("day1")

  const times = DAY_MAP[day]
  const validTimes = times.filter((t) => t.time != null)
  const sorted = [...validTimes].sort((a, b) => a.time - b.time)
  const minTime = Math.min(...sorted.map((d) => d.time))

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
  }

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
        ticks: {
          ...baseChartOptions.scales.y.ticks,
          callback: (v) => `+${v.toFixed(2)}s`,
        },
      },
    },
  }

  const crossDayOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      tooltip: {
        ...baseChartOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) =>
            ctx.raw != null
              ? `  ${ctx.dataset.label}: ${formatLapTime(ctx.raw)}`
              : null,
        },
      },
    },
    scales: {
      ...baseChartOptions.scales,
      y: {
        ...baseChartOptions.scales.y,
        ticks: {
          ...baseChartOptions.scales.y.ticks,
          callback: (v) => `${v}s`,
        },
      },
    },
  }

  return (
    <div>
      <div className="section-title">Lap Time Comparison</div>
      <div className="section-sub">
        Best times by driver — Bahrain International Circuit
      </div>

      <div className="day-selector">
        {["day1", "day2", "day3"].map((d) => (
          <button
            key={d}
            className={`day-btn ${day === d ? "active" : ""}`}
            onClick={() => setDay(d)}
          >
            {d === "day1" ? "DAY 1" : d === "day2" ? "DAY 2" : "DAY 3"}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Best Lap Times — Fastest to Slowest</div>
        <div style={{ height: 320 }}>
          <Bar data={buildBarData(sorted)} options={barOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Gap to Leader</div>
        <div style={{ height: 260 }}>
          <Line data={buildGapData(sorted)} options={gapOptions} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Full Timing Sheet</div>
        <TimingTable times={times} />
      </div>

      <div className="card">
        <div className="card-title">Driver Progression Across 3 Days (Top 12)</div>
        <div style={{ height: 340 }}>
          <Line data={buildCrossDayData()} options={crossDayOptions} />
        </div>
      </div>
    </div>
  )
}
