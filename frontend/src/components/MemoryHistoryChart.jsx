// MemoryHistoryChart.jsx
// Line chart for memory usage history. `data` should be
// [{ time: string, value: number }].
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function MemoryHistoryChart({ data }) {
  return (
    <div
        className="border-1 border-[#ddd] rounded-xl p-3 flex-1"

    >
      <h2 className="text-3xl pb-3 font-semibold">Memory Usage History</h2>
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

export default MemoryHistoryChart;
