// App.jsx
// Root of the frontend React app. Responsible for fetching
// periodic system data from the backend API and passing it to
// presentational components (cards, charts, tables).
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CpuCard from "./components/CpuCard.jsx";
import MemoryCard from "./components/MemoryCard.jsx";
import ProcessTable from "./components/ProcessTable.jsx";
import CpuHistoryChart from "./components/CpuHistoryChart.jsx";
import MemoryHistoryChart from "./components/MemoryHistoryChart.jsx";
import SummaryBar from "./components/SummaryBar.jsx";
import DiskTable from "./components/DiskTable.jsx";

const API_BASE = "http://localhost:4000";

function App() {
  const [cpu, setCpu] = useState(null);
  const [memory, setMemory] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memHistory, setMemHistory] = useState([]);
  const [procFilter, setProcFilter] = useState("");
  const [summary, setSummary] = useState(null);
  const [disk, setDisk] = useState({ devices: [] });

  // Fetch the current CPU usage from the backend and update
  // the CPU history array used by the chart.
  async function fetchCpu() {
    try {
      const res = await fetch(`${API_BASE}/api/cpu`);
      const data = await res.json();
      setCpu(data);

      const now = new Date();
      setCpuHistory((prev) => {
        const point = { time: now.toLocaleTimeString(), value: data.overall };
        const arr = [...prev, point];
        return arr.slice(-60); // keep last 60 samples
      });
    } catch (err) {
      console.error("Error fetching CPU:", err);
    }
  }

  // Fetch memory stats and append a percentage sample to
  // the memory history array for charting.
  async function fetchMemory() {
    try {
      const res = await fetch(`${API_BASE}/api/memory`);
      const m = await res.json();
      setMemory(m);

      const usedPercent = (m.used / m.total) * 100;
      const now = new Date();
      setMemHistory((prev) => {
        const point = { time: now.toLocaleTimeString(), value: usedPercent };
        const arr = [...prev, point];
        return arr.slice(-60);
      });
    } catch (err) {
      console.error("Error fetching memory:", err);
    }
  }

  // Fetch the list of processes (top consumers) from backend.
  async function fetchProcesses() {
    try {
      const res = await fetch(`${API_BASE}/api/processes`);
      const data = await res.json();
      setProcesses(data.processes || []);
    } catch (err) {
      console.error("Error fetching processes:", err);
    }
  }

  // Fetch uptime and load averages summary.
  async function fetchSummary() {
    try {
      const res = await fetch(`${API_BASE}/api/summary`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  }

  // Fetch disk I/O statistics (per device read/write rates).
  async function fetchDisk() {
    try {
      const res = await fetch(`${API_BASE}/api/disk`);
      const data = await res.json();
      setDisk(data);
    } catch (err) {
      console.error("Error fetching disk:", err);
    }
  }

  // Start a 2s polling interval to refresh all data shown in
  // the dashboard. Cleanup the timer when component unmounts.
  useEffect(() => {
    function refresh() {
      fetchCpu();
      fetchMemory();
      fetchProcesses();
      fetchSummary();
      fetchDisk();
    }

    refresh();
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow p-6">
        <h1 className="text-5xl text-center pb-5">Linux System Monitor</h1>

        {/* Uptime + load averages */}
        <SummaryBar summary={summary} />

        {/* CPU + Memory cards */}
        <div id="CPU"
        className="grid grid-cols-2 gap-4 scroll-mt-14"
        >
          <CpuCard cpu={cpu} />
          <MemoryCard memory={memory} />
        </div>

        {/* CPU + Memory history graphs */}
        <div
          className="flex gap-4 mt-8 flex-wrap"
        >
          <CpuHistoryChart data={cpuHistory} />
          <MemoryHistoryChart data={memHistory} />
        </div>

        {/* Disk I/O */}
        <div id="disk"
        className="flex gap-4 mt-8 flex-wrap scroll-mt-14"
        >
          <DiskTable disk={disk} />
        </div>

        {/* Processes table */}
        <div id="processes" className="scroll-mt-14">
        <ProcessTable
          processes={processes}
          filter={procFilter}
          onFilterChange={setProcFilter}
        />
        </div>
      </main>
      <div className="bg-gray-500">
      <Footer />
      </div>
    </div>
  );
}

export default App;
