// cpu.js
// Read /proc/stat and compute an overall CPU percentage by
// sampling twice with a small delay and measuring the delta.
import fs from "fs/promises";

// Parse the first `cpu ` line from /proc/stat and return the
// summed idle and total jiffies so callers can compute deltas.
function parseProcStat(text) {
  const line = text
    .split("\n")
    .find((l) => l.startsWith("cpu ")); // overall line

  const parts = line.trim().split(/\s+/).slice(1); // skip "cpu"
  const nums = parts.map((v) => parseInt(v, 10));

  const [
    user,
    nice,
    system,
    idle,
    iowait,
    irq,
    softirq,
    steal,
    guest,
    guest_nice,
  ] = nums;

  const idleAll = idle + iowait;
  const nonIdle = user + nice + system + irq + softirq + steal;
  const total = idleAll + nonIdle;

  return { idleAll, total };
}

async function readCpuRaw() {
  const text = await fs.readFile("/proc/stat", "utf8");
  return parseProcStat(text);
}

export async function getCpuUsage() {
  const s1 = await readCpuRaw();
  // small delay to measure difference
  // Wait a short interval so we can compute usage over time.
  await new Promise((resolve) => setTimeout(resolve, 200));
  const s2 = await readCpuRaw();

  const totald = s2.total - s1.total;
  const idled = s2.idleAll - s1.idleAll;
  const usage = ((totald - idled) / totald) * 100;

  return {
    overall: parseFloat(usage.toFixed(2)),
  };
}
