import fs from "fs/promises";
import path from "path";

// processes.js
// Walks /proc and computes per-process CPU% and RSS. To compute
// CPU usage we capture jiffies for processes and system-wide
// totals between calls and calculate a delta.

// Remember previous ticks between calls so we can compute deltas.
let prevTotalJiffies = null;
let prevProcTicks = new Map();
let prevNumCpus = 1;

// Read system-wide CPU jiffies and how many CPUs we have.
async function readCpuStatMeta() {
  const text = await fs.readFile("/proc/stat", "utf8");
  const lines = text.split("\n");
  const cpuLine = lines.find((l) => l.startsWith("cpu "));
  const parts = cpuLine.trim().split(/\s+/).slice(1).map((v) => parseInt(v, 10));
  const totalJiffies = parts.reduce((a, b) => a + b, 0);

  const numCpus = lines.filter((l) => /^cpu\d+\s+/.test(l)).length || 1;
  return { totalJiffies, numCpus };
}

// Read a single /proc/<pid> and extract basic metrics.
async function readProcPid(pid) {
  const base = `/proc/${pid}`;
  try {
    const [statText, statusText] = await Promise.all([
      fs.readFile(path.join(base, "stat"), "utf8"),
      fs.readFile(path.join(base, "status"), "utf8"),
    ]);

    const statParts = statText.split(" ");
    const comm = statParts[1];
    const utime = parseInt(statParts[13], 10);
    const stime = parseInt(statParts[14], 10);
    const cpuTicks = utime + stime;

    const statusLines = statusText.split("\n");
    let rssKB = 0;
    let name = "";
    let uid = "";

    for (const line of statusLines) {
      if (line.startsWith("Name:")) {
        name = line.split("\t")[1]?.trim() || "";
      } else if (line.startsWith("Uid:")) {
        uid = line.split("\t")[1]?.trim() || "";
      } else if (line.startsWith("VmRSS:")) {
        rssKB = parseInt(line.replace(/[^\d]/g, ""), 10) || 0;
      }
    }

    return {
      pid: parseInt(pid, 10),
      name: name || comm.replace(/[()]/g, ""),
      uid,
      cpuTicks,
      rss: rssKB * 1024,
    };
  } catch {
    return null; // process may have exited while we read it
  }
}

export async function getProcesses() {
  const { totalJiffies, numCpus } = await readCpuStatMeta();

  // read all numeric directories from /proc
  const dirents = await fs.readdir("/proc", { withFileTypes: true });
  const pids = dirents
    .filter((d) => d.isDirectory() && /^\d+$/.test(d.name))
    .map((d) => d.name);

  const promises = pids.map((pid) => readProcPid(pid));
  const all = await Promise.all(promises);
  const alive = all.filter((x) => x !== null);

  const deltaTotal =
    prevTotalJiffies === null ? 0 : totalJiffies - prevTotalJiffies;

  const newPrevProcTicks = new Map();

  // Compute per-process CPU% based on ticks delta and system delta.
  const withCpu = alive.map((p) => {
    const prevTicks = prevProcTicks.get(p.pid) || 0;
    const deltaProc = p.cpuTicks - prevTicks;

    let cpuPercent = 0;
    if (deltaTotal > 0 && prevTotalJiffies !== null) {
      cpuPercent = (deltaProc / deltaTotal) * 100 * numCpus;
    }

    newPrevProcTicks.set(p.pid, p.cpuTicks);

    return {
      pid: p.pid,
      name: p.name,
      uid: p.uid,
      rss: p.rss,
      cpuPercent: Number(cpuPercent.toFixed(1)),
    };
  });

  // Save state for next call
  prevTotalJiffies = totalJiffies;
  prevProcTicks = newPrevProcTicks;
  prevNumCpus = numCpus;

  // sort by CPU desc, then RSS
  withCpu.sort((a, b) => b.cpuPercent - a.cpuPercent || b.rss - a.rss);

  return withCpu.slice(0, 100); // top 100 processes
}
