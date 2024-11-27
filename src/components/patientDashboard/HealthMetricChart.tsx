"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";
import { Activity, Droplets } from "lucide-react";

interface HealthMetric {
	date: string;
	value: number;
}

interface HealthMetricsChartProps {
	title: string;
	subtitle: string;
	metrics: HealthMetric[];
	color: string;
	icon: "bp" | "sugar";
}

const iconMap = {
	bp: Activity,
	sugar: Droplets,
};

export function HealthMetricsChart({
	title,
	subtitle,
	metrics,
	color,
	icon,
}: HealthMetricsChartProps) {
	const Icon = iconMap[icon];

	return (
		<Card className="overflow-hidden transition-all hover:shadow-lg border-none bg-white">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center space-x-2">
					<div className={`p-2 rounded-full bg-${color}/10`}>
						<Icon className={`h-4 w-4 text-${color}`} />
					</div>
					<div>
						<CardTitle className="text-base font-medium">{title}</CardTitle>
						<p className="text-sm text-muted-foreground">{subtitle}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={metrics}
							margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
						>
							<defs>
								<linearGradient
									id={`gradient-${title}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop offset="0%" stopColor={color} stopOpacity={0.2} />
									<stop offset="100%" stopColor="#e9f2ff" stopOpacity={1} />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="#f0f0f0"
							/>
							<XAxis
								dataKey="date"
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) =>
									value.split("/")[0] + "/" + value.split("/")[1]
								}
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `${value}`}
								domain={["auto", "auto"]}
							/>
							<Tooltip
								content={({ active, payload, label }) => {
									if (active && payload && payload.length) {
										return (
											<div className="rounded-lg border bg-background p-4 shadow-md">
												<div className="flex flex-col">
													<span className="text-sm font-medium">{label}</span>
													<span className="text-lg font-bold" style={{ color }}>
														{payload[0].value}
													</span>
													<span className="text-xs text-muted-foreground">
														{subtitle}
													</span>
												</div>
											</div>
										);
									}
									return null;
								}}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke={color}
								strokeWidth={2}
								fill="#e9f2ff"
								animationDuration={2000}
								dot={{
									stroke: color,
									strokeWidth: 2,
									r: 4,
									fill: "white",
								}}
								activeDot={{
									stroke: color,
									strokeWidth: 2,
									r: 6,
									fill: "white",
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}

export function HealthMetricsGrid() {
	const bpData = [
		{ date: "24/04/2024", value: 120 },
		{ date: "16/04/2024", value: 135 },
		{ date: "10/04/2024", value: 128 },
		{ date: "05/04/2024", value: 142 },
		{ date: "01/04/2024", value: 130 },
	];

	const sugarData = [
		{ date: "24/04/2024", value: 95 },
		{ date: "16/04/2024", value: 110 },
		{ date: "10/04/2024", value: 105 },
		{ date: "05/04/2024", value: 98 },
		{ date: "01/04/2024", value: 102 },
	];

	return (
		<div className="grid gap-2 md:grid-cols-2">
			<HealthMetricsChart
				title="Blood Pressure"
				subtitle="Recent measurements (mmHg)"
				metrics={bpData}
				color="#ef4444"
				icon="bp"
			/>
			<HealthMetricsChart
				title="Blood Sugar"
				subtitle="Recent measurements (mg/dL)"
				metrics={sugarData}
				color="#3b82f6"
				icon="sugar"
			/>
		</div>
	);
}
