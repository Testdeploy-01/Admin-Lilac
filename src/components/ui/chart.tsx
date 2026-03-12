"use client"

import * as React from "react"
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    color?: string
  }
>

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

export function ChartContainer({
  id,
  className,
  children,
  config,
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}) {
  const uniqueId = React.useId().replace(/:/g, "")
  const chartId = `chart-${id ?? uniqueId}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-legend-item-text]:text-foreground [&_.recharts-layer:focus]:outline-none",
          className
        )}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, value]) => value.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig.map(([key, value]) => `  --color-${key}: ${value.color};`).join("\n")}
}
`,
      }}
    />
  )
}

export const ChartTooltip = Tooltip

export function ChartTooltipContent({
  active,
  payload,
  className,
  hideLabel = false,
}: {
  active?: boolean
  payload?: Array<{
    dataKey?: string | number
    name?: string
    value?: string | number
    color?: string
  }>
  className?: string
  hideLabel?: boolean
}) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className={cn("min-w-36 rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-sm", className)}>
      <div className="space-y-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "")
          const configItem = config[key]

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color ?? configItem?.color }}
                  aria-hidden="true"
                />
                <span>{hideLabel ? (configItem?.label ?? item.name) : item.name}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ChartLegend = Legend

export function ChartLegendContent({
  payload,
  className,
}: {
  payload?: Array<{
    dataKey?: string | number
    value?: string
    color?: string
  }>
  className?: string
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4 pt-3", className)}>
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value ?? "")
        const configItem = config[key]

        return (
          <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color ?? configItem?.color }}
              aria-hidden="true"
            />
            <span>{configItem?.label ?? item.value}</span>
          </div>
        )
      })}
    </div>
  )
}
