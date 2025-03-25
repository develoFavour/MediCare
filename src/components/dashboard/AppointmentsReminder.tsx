"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Calendar, Clock, CheckCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Reminder {
	_id: string;
	title: string;
	appointmentId: string;
	date: string;
	time: string;
	type: "check-in" | "preparation" | "follow-up";
	completed: boolean;
}

export function AppointmentReminders() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [reminders, setReminders] = useState<Reminder[]>([]);

	useEffect(() => {
		const fetchReminders = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get("/api/patient/appointment-reminders");
				setReminders(response.data.reminders);
			} catch (err) {
				console.error("Error fetching appointment reminders:", err);
				setError("Failed to load reminders");
			} finally {
				setLoading(false);
			}
		};

		fetchReminders();
	}, []);

	const markAsCompleted = async (id: string) => {
		try {
			await axios.patch(`/api/patient/appointment-reminders/${id}`, {
				completed: true,
			});

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

	const getReminderTypeColor = (type: string) => {
		switch (type) {
			case "check-in":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "preparation":
				return "bg-amber-100 text-amber-800 border-amber-200";
			case "follow-up":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold flex items-center">
						<Bell className="h-5 w-5 mr-2 text-amber-500" />
						Appointment Reminders
					</CardTitle>
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
						No appointment reminders found.
					</div>
				) : (
					<div className="space-y-4">
						{reminders.map((reminder) => (
							<div key={reminder._id} className="p-3 bg-gray-50 rounded-lg">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-medium text-gray-900">
											{reminder.title}
										</h3>
										<Badge
											variant="outline"
											className={`mt-1 ${getReminderTypeColor(reminder.type)}`}
										>
											{reminder.type
												.replace("-", " ")
												.replace(/\b\w/g, (l) => l.toUpperCase())}
										</Badge>
									</div>
									{reminder.completed ? (
										<Badge
											variant="outline"
											className="bg-green-100 text-green-800 border-green-200"
										>
											<CheckCircle className="mr-1 h-3 w-3" /> Completed
										</Badge>
									) : (
										<Button
											size="sm"
											variant="ghost"
											className="text-primary h-7 px-2"
											onClick={() => markAsCompleted(reminder._id)}
										>
											Mark Complete
										</Button>
									)}
								</div>
								<div className="mt-2 space-y-1">
									<div className="flex items-center text-sm text-gray-600">
										<Calendar className="w-4 h-4 mr-2 text-primary" />
										{new Date(reminder.date).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<Clock className="w-4 h-4 mr-2 text-primary" />
										{reminder.time}
									</div>
								</div>
								<div className="mt-3 flex justify-end">
									<Button
										size="sm"
										variant="outline"
										onClick={() =>
											router.push(
												`/patient/appointments/${reminder.appointmentId}`
											)
										}
									>
										View Appointment
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
