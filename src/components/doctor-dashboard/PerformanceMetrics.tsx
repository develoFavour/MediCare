import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PerformanceMetrics() {
	// This would typically come from an API
	const metrics = [
		{
			name: "Patient Satisfaction",
			value: 92,
			color: "bg-blue-500",
		},
		{
			name: "Appointment Completion",
			value: 88,
			color: "bg-green-500",
		},
		{
			name: "Response Time",
			value: 75,
			color: "bg-amber-500",
		},
		{
			name: "Documentation Quality",
			value: 95,
			color: "bg-purple-500",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Performance Metrics</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{metrics.map((metric) => (
						<div key={metric.name} className="space-y-2">
							<div className="flex justify-between">
								<span className="text-sm font-medium">{metric.name}</span>
								<span className="text-sm text-gray-500">{metric.value}%</span>
							</div>
							<Progress
								value={metric.value}
								className={`h-2 [&>div]:${metric.color}`}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
