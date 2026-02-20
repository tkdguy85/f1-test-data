import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export const baseChartOptions = {
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
}

export const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      ticks: {
        color: "#6b6b80",
        font: { family: "DM Mono", size: 10 },
        backdropColor: "transparent",
      },
      grid: { color: "#252530" },
      pointLabels: {
        color: "#aaaabc",
        font: { family: "Barlow Condensed", size: 12, weight: "600" },
      },
      angleLines: { color: "#252530" },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: "#aaaabc",
        font: { family: "DM Mono", size: 11 },
        boxWidth: 12,
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
}
