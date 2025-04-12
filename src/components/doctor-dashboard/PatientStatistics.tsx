import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, Calendar } from "lucide-react";

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
			<CardHeader>
				<CardTitle>Patient Statistics</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="flex items-center gap-4">
						<div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
							<Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Total Patients</p>
							<p className="text-2xl font-bold">{totalPatients}</p>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
							<Star className="h-5 w-5 text-amber-600 dark:text-amber-300" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Average Rating</p>
							<div className="flex items-center">
								<p className="text-2xl font-bold">{averageRating}</p>
								<div className="flex ml-2">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < Math.floor(averageRating)
													? "text-amber-500 fill-amber-500"
													: i < averageRating
													? "text-amber-500 fill-amber-500 opacity-50"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
							<Calendar className="h-5 w-5 text-green-600 dark:text-green-300" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Total Appointments</p>
							<p className="text-2xl font-bold">{totalAppointments}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
