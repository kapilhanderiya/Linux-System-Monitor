// CpuCard.jsx
// Small presentational component that shows the current overall
// CPU usage percentage. Kept intentionally simple — receives a
// `cpu` object (from backend) and renders it, or a loading state.
function CpuCard({ cpu }) {
  return (
    <div
    className="border-1 border-[#ddd] rounded-xl p-3 min-w-[240px]"
    >
      <h2 className="text-3xl font-semibold">CPU</h2>
      {cpu ? (
        <div className="pt-3 text-lg">
          <p>Overall usage: <strong>{cpu.overall}%</strong></p>
        </div>
      ) : (
        <p>Loading CPU...</p>
      )}
    </div>
  );
}

export default CpuCard;
