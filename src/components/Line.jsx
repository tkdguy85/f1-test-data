import { Line } from 'react-chartjs-2'
import teamData from '../data/raw_data/SAMPLE_DATA'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js'

// Needed to render the graphs
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const LineGraph = () => {
  const options = {}
  
  return <Line options={options} data={teamData}/>
}
