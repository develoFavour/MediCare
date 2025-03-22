import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PerformanceMetrics() {
	const metrics = [
		{ name: "Patient Satisfaction", value: 92, color: "bg-green-500" },
		{ name: "Appointment Completion", value: 88, color: "bg-blue-500" },
		{ name: "Documentation Timeliness", value: 75, color: "bg-amber-500" },
		{ name: "Follow-up Rate", value: 82, color: "bg-purple-500" },
	];

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-semibold text-gray-800">
					Performance Metrics
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{metrics.map((metric) => (
						<div key={metric.name}>
							<div className="flex justify-between mb-1">
								<span className="text-sm text-gray-600">{metric.name}</span>
								<span className="text-sm font-medium text-gray-800">
									{metric.value}%
								</span>
							</div>
							<Progress
								value={metric.value}
								className={`h-2 ${metric.color}`}
							/>
						</div>
					))}
				</div>

				<div className="mt-6 pt-4 border-t border-gray-100">
					<h4 className="text-sm font-medium text-gray-700 mb-2">
						Monthly Performance
					</h4>
					<div className="flex items-center justify-between">
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">92%</div>
							<div className="text-xs text-gray-500">Overall</div>
						</div>
						<div className="h-8 border-r border-gray-200"></div>
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">+5%</div>
							<div className="text-xs text-gray-500">From Last Month</div>
						</div>
						<div className="h-8 border-r border-gray-200"></div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">Top 10%</div>
							<div className="text-xs text-gray-500">Ranking</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
