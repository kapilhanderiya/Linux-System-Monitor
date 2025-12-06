// DiskTable.jsx
// Shows recent disk I/O rates per device. The backend reports
// bytes-per-second for reads/writes and we format to KB/s here.
function bytesToKBps(bytes) {
  return (bytes / 1024).toFixed(1);
}

function DiskTable({ disk }) {
  const devices = disk?.devices || [];

  return (
    <div className="mt-8 border-1 border-[#ddd] rounded-xl p-3 w-full">
      <h2 className="text-3xl font-semibold mb-3">Disk I/O</h2>

      <div className="max-h-80 overflow-auto border border-gray-200 rounded">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className={thClass}>Device</th>
              <th className={thClass}>Read (KB/s)</th>
              <th className={thClass}>Write (KB/s)</th>
            </tr>
          </thead>

          <tbody>
            {devices.length > 0 ? (
              devices.map((d) => (
                <tr key={d.name} className="hover:bg-gray-50">
                  <td className={tdClass}>{d.name}</td>
                  <td className={tdClass}>{bytesToKBps(d.readsPerSecBytes)}</td>
                  <td className={tdClass}>{bytesToKBps(d.writesPerSecBytes)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={tdClass} colSpan={3}>
                  No disk activity recorded yet… (wait 2–3 seconds)
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
  "border border-gray-300 px-2 py-2 text-xl text-left font-semibold text-gray-700";
const tdClass = "border border-gray-200 px-2 py-2 text-gray-800";

export default DiskTable;
