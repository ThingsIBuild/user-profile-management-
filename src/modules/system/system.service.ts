import si from "systeminformation";

export const getSystemInfo = async () => {
  // uptime (in seconds)
  const uptime = process.uptime();

  // CPU
  const cpuLoad = await si.currentLoad();

  // Memory
  const mem = await si.mem();

  // Disk
  const disk = await si.fsSize();

  // Processes
  const processes = await si.processes();

  // Top 5 by CPU
  const topCpu = processes.list
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 5);

  // Top 5 by Memory
  const topMem = processes.list
    .sort((a, b) => b.mem - a.mem)
    .slice(0, 5);

  return {
    uptime: `${Math.floor(uptime)} seconds`,

    cpu: {
      usage: `${cpuLoad.currentLoad.toFixed(2)}%`
    },

    memory: {
      total: `${(mem.total / 1024 / 1024).toFixed(2)} MB`,
      used: `${(mem.used / 1024 / 1024).toFixed(2)} MB`,
      free: `${(mem.free / 1024 / 1024).toFixed(2)} MB`,
      usagePercent: `${((mem.used / mem.total) * 100).toFixed(2)}%`
    },

    disk: disk.map(d => ({
      filesystem: d.fs,
      size: `${(d.size / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${(d.used / 1024 / 1024 / 1024).toFixed(2)} GB`,
      available: `${(d.available / 1024 / 1024 / 1024).toFixed(2)} GB`,
      usagePercent: `${d.use}%`
    })),

    topProcesses: {
      byCPU: topCpu.map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: `${p.cpu}%`
      })),
      byMemory: topMem.map(p => ({
        pid: p.pid,
        name: p.name,
        memory: `${p.mem}%`
      }))
    }
  };
};