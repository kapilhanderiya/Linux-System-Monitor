// disk.js
// Extract disk sectors counters from /proc/diskstats and report
// simple read/write bytes-per-second estimates. Assumes 512B
// sectors (commonly true) — callers can format or explain units.
import fs from "fs/promises";

let prevDiskStats = new Map(); // name -> { sectorsRead, sectorsWritten }
let prevDiskTime = null;

function parseDiskstats(text) {
  const lines = text.trim().split("\n");
  const result = new Map();

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 14) continue;

    const name = parts[2]; // device name
    // skip loop & ram devices (optional)
    if (name.startsWith("loop") || name.startsWith("ram")) continue;

    const sectorsRead = parseInt(parts[5], 10);    // # sectors read
    const sectorsWritten = parseInt(parts[9], 10); // # sectors written

    result.set(name, { sectorsRead, sectorsWritten });
  }
  return result;
}

export async function getDiskStats() {
  const text = await fs.readFile("/proc/diskstats", "utf8");
  const now = Date.now();
  const current = parseDiskstats(text);

  if (prevDiskTime === null) {
    // first call: no rate info yet
    prevDiskStats = current;
    prevDiskTime = now;
    return { devices: [] };
  }

  const dt = (now - prevDiskTime) / 1000.0; // seconds
  const devices = [];

  for (const [name, cur] of current.entries()) {
    const prev = prevDiskStats.get(name) || cur;

    const dRead = cur.sectorsRead - prev.sectorsRead;
    const dWrite = cur.sectorsWritten - prev.sectorsWritten;

    // assume 512-byte sectors (mention in report)
    const bytesReadPerSec = (dRead * 512) / dt;
    const bytesWrittenPerSec = (dWrite * 512) / dt;

    devices.push({
      name,
      readsPerSecBytes: Math.max(0, bytesReadPerSec),
      writesPerSecBytes: Math.max(0, bytesWrittenPerSec),
    });
  }

  prevDiskStats = current;
  prevDiskTime = now;

  // sort by total I/O descending
  devices.sort(
    (a, b) =>
      b.readsPerSecBytes +
      b.writesPerSecBytes -
      (a.readsPerSecBytes + a.writesPerSecBytes),
  );

  return { devices };
}