import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HealthGoal {
	id: string;
	title: string;
	currentValue: number;
	targetValue: number;
	unit: string;
}

export function HealthGoalsProgress({ goals }: { goals: HealthGoal[] }) {
	return (
		<Card className="bg-white shadow-md">
			<CardHeader className="bg-[#116aef] text-white">
				<CardTitle className="text-lg font-semibold">
					Health Goals Progress
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				{goals.map((goal) => {
					const progress = (goal.currentValue / goal.targetValue) * 100;
					return (
						<div key={goal.id} className="mb-4 last:mb-0">
							<div className="flex justify-between items-center mb-2">
								<h3 className="font-medium text-[#116aef]">{goal.title}</h3>
								<span className="text-sm text-gray-600">
									{goal.currentValue}/{goal.targetValue} {goal.unit}
								</span>
							</div>
							<Progress
								value={progress}
								className="h-2 bg-[#e9f2ff]"
								// indicatorClassName="bg-[#116aef]"
							/>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
