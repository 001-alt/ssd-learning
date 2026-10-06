import type { ReactNode } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="学习进度"
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Chart({
  data,
  lines,
  height = 270,
  unit = "",
  domain,
}: {
  data: object[];
  lines: { key: string; name: string; color: string }[];
  height?: number;
  unit?: string;
  domain?: [number, number];
}) {
  return (
    <div
      className="chart"
      style={{ height }}
      role="img"
      aria-label={`${lines.map((l) => l.name).join("、")}趋势图，单位 ${unit}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
        >
          <defs>
            {lines.map((l) => (
              <linearGradient
                key={l.key}
                id={`gradient-${l.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={l.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={l.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="#e9eef3"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            minTickGap={30}
            tick={{ fill: "#8493a5", fontSize: 12 }}
          />
          <YAxis
            domain={domain || ["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8493a5", fontSize: 12 }}
            width={52}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e3ebf1" }}
            formatter={(v) => `${v} ${unit}`}
          />
          <Legend iconType="circle" iconSize={7} />
          {lines.map((l) => (
            <Area
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name}
              stroke={l.color}
              strokeWidth={2.5}
              fill={`url(#gradient-${l.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
