// components/home/organisms/AmelChartSection.tsx
import { RadialBarChart } from "@/components/charts/radial-bar-chart";
import React, { memo } from "react";

interface Props {
  data: { label: string; value: number }[];
}

export const AmelChartSection = memo(({ data }: Props) => {
  if (data.length === 0) return null;

  return (
    <RadialBarChart
      data={data}
      config={{ animated: true, duration: 1000, gradient: true }}
    />
  );
});
