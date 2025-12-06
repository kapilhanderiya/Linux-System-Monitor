// backend/src/index.js
// backend/src/index.js
// Simple Express backend that exposes lightweight endpoints for
// CPU, memory, processes, summary and disk statistics. These
// endpoints read from procfs and return JSON to the frontend.
import express from "express";
import cors from "cors";
import { exec } from "child_process";

import { getCpuUsage } from "./cpu.js";
import { getMemoryInfo } from "./memory.js";
import { getProcesses } from "./processes.js";
import { getSummary } from "./summary.js";
import { getDiskStats } from "./disk.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// CPU
app.get("/api/cpu", async (req, res) => {
  try {
    const data = await getCpuUsage();
    res.json(data);
  } catch (err) {
    console.error("CPU route error:", err);
    res.status(500).json({ error: "CPU read failed" });
  }
});

// Memory
app.get("/api/memory", async (req, res) => {
  try {
    const data = await getMemoryInfo();
    res.json(data);
  } catch (err) {
    console.error("Memory route error:", err);
    res.status(500).json({ error: "Memory read failed" });
  }
});

// Processes
app.get("/api/processes", async (req, res) => {
  try {
    const data = await getProcesses();
    res.json({ processes: data });
  } catch (err) {
    console.error("Processes route error:", err);
    res.status(500).json({ error: "Process read failed" });
  }
});

// 🔴 KILL PROCESS
app.post("/api/processes/:pid/kill", (req, res) => {
  const { pid } = req.params;

  if (!/^\d+$/.test(pid)) {
    return res.status(400).json({ error: "Invalid PID" });
  }

  // log for debugging — the frontend sends a kill request when
  // a user clicks "Kill" in the process table (after confirm).
  console.log("Kill route hit for PID", pid);

  exec(`kill -TERM ${pid}`, (error) => {
    if (error) {
      console.error("Kill error:", error.message);
      return res.status(500).json({ error: "Failed to kill process" });
    }

    res.json({ success: true, pid: Number(pid) });
  });
});


// Summary (uptime + loadavg)
app.get("/api/summary", async (req, res) => {
  try {
    const data = await getSummary();
    res.json(data);
  } catch (err) {
    console.error("Summary route error:", err);
    res.status(500).json({ error: "Summary read failed" });
  }
});

// Disk I/O
app.get("/api/disk", async (req, res) => {
  try {
    const data = await getDiskStats();
    res.json(data);
  } catch (err) {
    console.error("Disk route error:", err);
    res.status(500).json({ error: "Disk read failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
