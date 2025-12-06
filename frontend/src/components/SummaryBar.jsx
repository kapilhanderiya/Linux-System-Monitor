// SummaryBar.jsx
// Compact summary showing system uptime and load averages.
// `summary` should include `uptimeHuman` and `loadavg` fields.
function SummaryBar({ summary }) {
  return (
    <span
      className="border-1 border-[#ddd] rounded-xl px-3 py-3 inline-flex gap-8 items-center float-right ml-2"
      
    >
      {summary ? (
        <>
          <span>
            <strong>Uptime:</strong> {summary.uptimeHuman}
          </span>
          <span>
            <strong>Load avg:</strong>{" "}
            {summary.loadavg["1min"].toFixed(2)},{" "}
            {summary.loadavg["5min"].toFixed(2)},{" "}
            {summary.loadavg["15min"].toFixed(2)}
          </span>
        </>
      ) : (
        <span>Loading summary…</span>
      )}
    </span>
  );
}

export default SummaryBar;
