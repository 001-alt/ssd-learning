export const telemetry = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  temperature: Math.round(
    39 + Math.sin(i / 3) * 5 + (i > 12 && i < 18 ? 8 : 0),
  ),
  reads: Math.round(120 + Math.sin(i / 2) * 65 + (i > 12 && i < 18 ? 100 : 0)),
  writes: Math.round(70 + Math.cos(i / 3) * 40 + (i > 12 && i < 18 ? 100 : 0)),
  health: +(98.6 - i * 0.015).toFixed(2),
  capacity: +(684 - i * 1.2).toFixed(1),
}));
export const weeklyActivity = [
  { day: "周一", minutes: 18 },
  { day: "周二", minutes: 32 },
  { day: "周三", minutes: 24 },
  { day: "周四", minutes: 46 },
  { day: "周五", minutes: 35 },
  { day: "周六", minutes: 58 },
  { day: "周日", minutes: 28 },
];
export const cumulativeIO = telemetry.map((d, i) => ({
  time: d.time,
  readTotal: +(
    28.1 +
    telemetry
      .slice(0, i + 1)
      .reduce((sum, sample) => sum + (sample.reads * 3600) / 1e6, 0)
  ).toFixed(2),
  writeTotal: +(
    12.4 +
    telemetry
      .slice(0, i + 1)
      .reduce((sum, sample) => sum + (sample.writes * 3600) / 1e6, 0)
  ).toFixed(2),
}));
export type Scenario = "daily" | "gaming" | "creation";
export const scenarios: Record<
  Scenario,
  { title: string; description: string; block: string; factor: number }
> = {
  daily: {
    title: "日常办公",
    description: "低队列深度，关注小块 IO 的响应时间。",
    block: "4 KiB",
    factor: 0.68,
  },
  gaming: {
    title: "游戏加载",
    description: "混合读取，关注资源加载与随机读取。",
    block: "64 KiB",
    factor: 0.84,
  },
  creation: {
    title: "内容创作",
    description: "大文件顺序读写，关注持续吞吐表现。",
    block: "1 MiB",
    factor: 1,
  },
};
export function benchmark(scenario: Scenario, qd: number, run: number) {
  const f = scenarios[scenario].factor * (0.83 + Math.log2(qd + 1) * 0.035);
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${(i + 1) * 5}s`,
    read: Math.round((3300 + Math.sin(i + run) * 180) * f),
    write: Math.round((i < 6 ? 2800 : 1650) * f + Math.cos(i + run) * 120),
    iops: Math.round(
      (qd * 9500 + 14000) * scenarios[scenario].factor +
        Math.sin(i + run) * 2000,
    ),
  }));
}
