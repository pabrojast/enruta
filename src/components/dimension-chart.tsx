"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dimensionBars } from "@/lib/reports";

export function DimensionChart({
  dimensions,
}: {
  dimensions: Record<string, number>;
}) {
  const data = dimensionBars(dimensions);
  return (
    <div className="h-64 w-full" role="img" aria-label="Gráfico de intereses">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#b7c0cc", fontSize: 11 }} />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#b7c0cc", fontSize: 11 }}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "#0d111a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
            }}
          />
          <Bar dataKey="value" fill="url(#enrutaGrad)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="enrutaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b6ff3b" />
              <stop offset="50%" stopColor="#2de2c5" />
              <stop offset="100%" stopColor="#ff2d95" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
