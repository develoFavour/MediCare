"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

// Sample data for different metrics
const patientsByDepartment = [
	{ name: "Cardiology", value: 145, color: "#2196f3" },
	{ name: "Neurology", value: 98, color: "#4caf50" },
	{ name: "Pediatrics", value: 127, color: "#f44336" },
	{ name: "Orthopedics", value: 84, color: "#ff9800" },
	{ name: "Oncology", value: 63, color: "#9c27b0" },
];

const patientsByAge = [
	{ name: "0-18", value: 87, color: "#2196f3" },
	{ name: "19-35", value: 124, color: "#4caf50" },
	{ name: "36-50", value: 156, color: "#f44336" },
	{ name: "51-65", value: 132, color: "#ff9800" },
	{ name: "65+", value: 98, color: "#9c27b0" },
];

const appointmentsByMonth = [
	{ name: "Jan", value: 210 },
	{ name: "Feb", value: 180 },
	{ name: "Mar", value: 250 },
	{ name: "Apr", value: 270 },
	{ name: "May", value: 320 },
	{ name: "Jun", value: 290 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function AnalyticsDashboard() {
	const [activeTab, setActiveTab] = useState("departments");

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle>Interactive Analytics</CardTitle>
					<CardDescription>
						Explore patient data with interactive visualizations
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						defaultValue="departments"
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-4"
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="departments">By Department</TabsTrigger>
							<TabsTrigger value="age">By Age</TabsTrigger>
							<TabsTrigger value="appointments">By Month</TabsTrigger>
						</TabsList>

						<TabsContent value="departments" className="h-[400px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={patientsByDepartment}
										cx="50%"
										cy="50%"
										labelLine={true}
										outerRadius={150}
										fill="#8884d8"
										dataKey="value"
										label={({ name, percent }) =>
											`${name}: ${(percent * 100).toFixed(0)}%`
										}
										animationBegin={0}
										animationDuration={1500}
									>
										{patientsByDepartment.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value) => [`${value} patients`, "Count"]}
									/>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</TabsContent>

						<TabsContent value="age" className="h-[400px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={patientsByAge}
									margin={{
										top: 20,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip
										formatter={(value) => [`${value} patients`, "Count"]}
									/>
									<Legend />
									<Bar
										dataKey="value"
										name="Patients"
										fill="#116aef"
										animationBegin={0}
										animationDuration={1500}
									>
										{patientsByAge.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</TabsContent>

						<TabsContent value="appointments" className="h-[400px]">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={appointmentsByMonth}
									margin={{
										top: 10,
										right: 30,
										left: 0,
										bottom: 0,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip
										formatter={(value) => [`${value} appointments`, "Count"]}
									/>
									<Legend />
									<Area
										type="monotone"
										dataKey="value"
										name="Appointments"
										stroke="#116aef"
										fill="#116aef"
										fillOpacity={0.3}
										animationBegin={0}
										animationDuration={1500}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</motion.div>
	);
}
