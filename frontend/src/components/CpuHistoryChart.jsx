// CpuHistoryChart.jsx
// Renders a small time-series line chart of recent CPU usage.
// Expects `data` as an array of { time, value } samples.
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function CpuHistoryChart({ data }) {
  return (
    <div
    className="border-1 border-[#ddd] rounded-xl p-3 flex-1"

    >
      <h2 className="text-3xl pb-3 font-semibold">CPU History</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" hide={data.length > 15} />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CpuHistoryChart;
