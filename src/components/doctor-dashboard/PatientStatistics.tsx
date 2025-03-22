import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Star, UserPlus } from "lucide-react";

interface PatientStatisticsProps {
	totalPatients: number;
	averageRating: number;
	totalAppointments: number;
}

export default function PatientStatistics({
	totalPatients,
	averageRating,
	totalAppointments,
}: PatientStatisticsProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-semibold text-gray-800">
					Patient Statistics
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center p-3 bg-blue-50 rounded-lg">
					<div className="rounded-full bg-blue-100 p-2 mr-3">
						<UserPlus className="h-5 w-5 text-blue-600" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-gray-500">Total Patients</p>
						<h3 className="text-xl font-bold text-gray-800">{totalPatients}</h3>
					</div>
				</div>

				<div className="flex items-center p-3 bg-yellow-50 rounded-lg">
					<div className="rounded-full bg-yellow-100 p-2 mr-3">
						<Star className="h-5 w-5 text-yellow-600" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-gray-500">Average Rating</p>
						<div className="flex items-center">
							<h3 className="text-xl font-bold text-gray-800 mr-2">
								{averageRating}
							</h3>
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-4 w-4 ${
											i < Math.floor(averageRating)
												? "text-yellow-500 fill-yellow-500"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center p-3 bg-purple-50 rounded-lg">
					<div className="rounded-full bg-purple-100 p-2 mr-3">
						<Activity className="h-5 w-5 text-purple-600" />
					</div>
					<div className="flex-1">
						<p className="text-sm text-gray-500">Total Appointments</p>
						<h3 className="text-xl font-bold text-gray-800">
							{totalAppointments}
						</h3>
					</div>
				</div>

				<div className="mt-2">
					<div className="text-sm text-gray-500 mb-2">Patient Growth</div>
					<div className="grid grid-cols-7 gap-1 h-16">
						{[35, 45, 30, 65, 40, 50, 60].map((height, index) => (
							<div key={index} className="bg-gray-100 rounded-t-sm relative">
								<div
									className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-500"
									style={{ height: `${height}%` }}
								></div>
							</div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-1 mt-1">
						{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
							<div key={index} className="text-xs text-center text-gray-500">
								{day}
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
