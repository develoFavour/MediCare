"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Reminder {
	_id: string;
	title: string;
	description: string;
	dueDate: string;
	priority: "high" | "medium" | "low";
	completed: boolean;
}

export function HealthReminders() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [reminders, setReminders] = useState<Reminder[]>([]);

	useEffect(() => {
		const fetchReminders = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get("/api/patient/reminders");
				setReminders(response.data.reminders);
			} catch (err) {
				console.error("Error fetching health reminders:", err);
				setError("Failed to load reminders");
			} finally {
				setLoading(false);
			}
		};

		fetchReminders();
	}, []);

	const markAsCompleted = async (id: string) => {
		try {
			await axios.patch(`/api/patient/reminders/${id}`, { completed: true });

			// Update the local state
			setReminders(
				reminders.map((reminder) =>
					reminder._id === id ? { ...reminder, completed: true } : reminder
				)
			);
		} catch (err) {
			console.error("Error marking reminder as completed:", err);
		}
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold flex items-center">
						<AlertCircle className="h-5 w-5 mr-2 text-red-500" />
						Health Reminders
					</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						className="text-primary"
						onClick={() => router.push("/patient/reminders")}
					>
						Manage Reminders <ArrowRight className="ml-1 h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex space-x-3">
								<Skeleton className="h-6 w-6 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						))}
					</div>
				) : error ? (
					<div className="text-center text-red-500 py-4">
						{error}. Please try refreshing the page.
					</div>
				) : reminders.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						No health reminders found.
					</div>
				) : (
					<div className="space-y-4">
						{reminders.map((reminder) => (
							<div key={reminder._id} className="flex items-start group">
								{reminder.completed ? (
									<CheckCircle className="w-6 h-6 mr-3 text-green-500 flex-shrink-0" />
								) : (
									<button
										onClick={() => markAsCompleted(reminder._id)}
										className="focus:outline-none"
									>
										<AlertCircle
											className={`w-6 h-6 mr-3 flex-shrink-0 ${
												reminder.priority === "high"
													? "text-red-500"
													: reminder.priority === "medium"
													? "text-amber-500"
													: "text-blue-500"
											} group-hover:opacity-70 transition-opacity`}
										/>
									</button>
								)}
								<div>
									<h3
										className={`font-medium ${
											reminder.completed ? "text-green-700" : "text-gray-900"
										}`}
									>
										{reminder.title}
									</h3>
									<p className="text-sm text-gray-600">
										{reminder.description}
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Due:{" "}
										{new Date(reminder.dueDate).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
