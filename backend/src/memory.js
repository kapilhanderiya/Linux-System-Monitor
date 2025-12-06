// memory.js
// Reads `/proc/meminfo` and returns a normalized object with
// byte-sized values and a quick `used` field. Values in
// /proc/meminfo are reported in kB so we convert to bytes here.
import fs from "fs/promises";

export async function getMemoryInfo() {
  const text = await fs.readFile("/proc/meminfo", "utf8");
  const lines = text.split("\n");
  const map = {};

  // Build a simple map of key -> numeric kB value
  for (const line of lines) {
    if (!line.trim()) continue;
    const [key, rest] = line.split(":");
    const value = parseInt(rest, 10); // in kB
    map[key] = value; // kB
  }

  const total = map["MemTotal"] * 1024;
  const free = map["MemFree"] * 1024;
  const available = (map["MemAvailable"] || 0) * 1024;
  const buffers = map["Buffers"] * 1024;
  const cached = map["Cached"] * 1024;
  const swapTotal = map["SwapTotal"] * 1024;
  const swapFree = map["SwapFree"] * 1024;

  return {
    total,
    free,
    available,
    used: total - free,
    buffers,
    cached,
    swapTotal,
    swapUsed: swapTotal - swapFree,
  };
}
