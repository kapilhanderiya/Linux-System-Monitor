// ProcessTable.jsx
// Shows top processes and provides a simple "Kill" action.
// Calls the backend `POST /api/processes/:pid/kill` when user
// confirms. The `processes` prop should be an array of objects
// with { pid, name, uid, cpuPercent, rss }.
const API_BASE = "http://localhost:4000";

function bytesToMB(b) {
  return (b / (1024 * 1024)).toFixed(1);
}

function ProcessTable({ processes, filter, onFilterChange }) {
  const query = filter.toLowerCase();

  const filtered = processes.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      String(p.pid).includes(query) ||
      (p.uid && String(p.uid).includes(query))
    );
  });

  async function handleKill(pid) {
    const ok = window.confirm(`Kill process ${pid}?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/processes/${pid}/kill`, {
        method: "POST",
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response from kill:", text);
        alert("Kill failed (non-JSON response). Check backend / console.");
        return;
      }

      const data = await res.json();

      if (data.success) {
        alert(`Process ${pid} killed`);
      } else {
        alert(data.error || "Failed to kill process");
      }
    } catch (err) {
      console.error("Kill error:", err);
      alert("Error killing process (see console)");
    }
  }

  return (
    <div className="mt-8 border-1 border-[#ddd] rounded-xl p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-semibold">Top Processes</h2>
        <input
          type="text"
          placeholder="Filter by name / PID / UID"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="max-h-96 overflow-auto border border-gray-200 rounded">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className={thClass}>PID</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>UID</th>
              <th className={thClass}>CPU %</th>
              <th className={thClass}>RSS (MB)</th>
              <th className={thClass}>Kill</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.pid} className="hover:bg-gray-50">
                <td className={tdClass}>{p.pid}</td>
                <td className={tdClass}>{p.name}</td>
                <td className={tdClass}>{p.uid}</td>
                <td className={tdClass}>
                  {p.cpuPercent != null ? p.cpuPercent.toFixed(1) : "0.0"}
                </td>
                <td className={tdClass}>{bytesToMB(p.rss)}</td>
                <td className={tdClass}>
                  <button
                    className="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                    onClick={() => handleKill(p.pid)}
                  >
                    Kill
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className={tdClass} colSpan={6}>
                  No processes match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thClass =
  "border border-gray-300 px-2 py-1 text-xl text-lef font-semibold text-gray-700";
const tdClass = "border border-gray-200 px-2 py-1 text-gray-800";

export default ProcessTable;
