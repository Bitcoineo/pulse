"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type DataItem = { name: string; count: number; percentage: number };

const COLORS = ["#F97316", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#6366F1"];

type Props = {
  title: string;
  data: DataItem[];
  nameKey?: string;
};

export default function DonutChartCard({ title, data, nameKey = "name" }: Props) {
  return (
    <div className="rounded-xl border border-stone-100 bg-white p-4 sm:p-6">
      <h3 className="mb-4 text-sm font-semibold text-stone-700">{title}</h3>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className="h-[150px] w-[150px] flex-shrink-0 sm:h-[180px] sm:w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e7e5e4",
                  fontSize: "13px",
                }}
                formatter={(value) => [(value as number).toLocaleString(), "Views"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-stone-700 truncate">{(item as Record<string, unknown>)[nameKey] as string}</span>
              <span className="ml-auto text-stone-500 font-mono tabular-nums">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
