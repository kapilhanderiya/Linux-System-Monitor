// MemoryCard.jsx
// Displays memory statistics (total, used, free, cache, swap).
// Accepts `memory` object returned by backend's `/api/memory`.
function bytesToMB(b) {
  return (b / (1024 * 1024)).toFixed(1);
}

function MemoryCard({ memory }) {
  return (
    <div
    className="border-1 border-[#ddd] rounded-xl p-3 min-w-[260px]"
    >
      <h2 className="text-3xl font-semibold">Memory</h2>
      {memory ? (
        <ul className="pt-3 pl-4 text-lg list-disc">
          <li>Total: {bytesToMB(memory.total)} MB</li>
          <li>Used: {bytesToMB(memory.used)} MB</li>
          <li>Free: {bytesToMB(memory.free)} MB</li>
          <li>Available: {bytesToMB(memory.available)} MB</li>
          <li>Buffers: {bytesToMB(memory.buffers)} MB</li>
          <li>Cached: {bytesToMB(memory.cached)} MB</li>
          <li>
            Swap: {bytesToMB(memory.swapUsed)} /{" "}
            {bytesToMB(memory.swapTotal)} MB
          </li>
        </ul>
      ) : (
        <p>Loading memory...</p>
      )}
    </div>
  );
}

export default MemoryCard;
