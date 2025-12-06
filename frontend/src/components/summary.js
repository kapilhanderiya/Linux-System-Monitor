// summary.js
// Small helper that reads uptime and load averages from procfs
// and returns a human-friendly representation used in the UI.
import fs from "fs/promises";

export async function getSummary() {
  // /proc/uptime: "<uptime> <idle>"
  const uptimeText = await fs.readFile("/proc/uptime", "utf8");
  const [uptimeSecStr] = uptimeText.trim().split(" ");
  const uptimeSec = parseFloat(uptimeSecStr);

  // /proc/loadavg: "1min 5min 15min ..."
  const loadText = await fs.readFile("/proc/loadavg", "utf8");
  const [l1, l5, l15] = loadText.trim().split(" ");

  // Format uptime seconds into a short human string (e.g. 1d 3h 5m)
  function formatUptime(sec) {
    const days = Math.floor(sec / (24 * 3600));
    sec %= 24 * 3600;
    const hours = Math.floor(sec / 3600);
    sec %= 3600;
    const minutes = Math.floor(sec / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  return {
    uptimeSeconds: uptimeSec,
    uptimeHuman: formatUptime(uptimeSec),
    loadavg: {
      "1min": parseFloat(l1),
      "5min": parseFloat(l5),
      "15min": parseFloat(l15),
    },
  };
}
