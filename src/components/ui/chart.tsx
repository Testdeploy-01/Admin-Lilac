import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext } from "react";
import { ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { cn } from "../../lib/utils";

type ChartSeriesConfig = {
  label?: ReactNode;
  color?: string;
};

export type ChartConfig = Record<string, ChartSeriesConfig>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = createContext<ChartContextValue | null>(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within ChartContainer");
  }
  return context;
}

function resolveChartColor(color?: string) {
  if (!color) return color;
  const trimmed = color.trim();
  if (trimmed.startsWith("hsl(") || trimmed.startsWith("#") || trimmed.startsWith("rgb(")) {
    return trimmed;
  }
  if (trimmed.startsWith("var(")) {
    return `hsl(${trimmed})`;
  }
  return trimmed;
}

interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: ReactNode;
}

export function ChartContainer({ config, className, style, children, ...props }: ChartContainerProps) {
  const cssVariables = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
    const resolvedColor = resolveChartColor(value.color);
    if (resolvedColor) {
      acc[`--color-${key}`] = resolvedColor;
    }
    return acc;
  }, {});

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn("w-full h-full min-h-[inherit] [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-text]:fill-muted-foreground", className)}
        style={{ ...(cssVariables as CSSProperties), ...style }}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = RechartsTooltip;

type PayloadItem = {
  name?: string;
  value?: number | string;
  dataKey?: string | number;
  color?: string;
};

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-40 rounded-lg bg-card px-3 py-2 text-xs shadow-md">
      {label ? <p className="mb-2 text-muted-foreground">{label}</p> : null}
      <div className="space-y-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "value");
          const series = config[key];
          const displayName = series?.label ?? item.name ?? key;
          const color = `var(--color-${key})`;

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{displayName}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value ?? "-"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

