"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Calendar } from "lucide-react";
import axios from "axios";

interface Announcement {
	_id: string;
	title: string;
	content: string;
	date: string;
	type: "general" | "service" | "emergency" | "covid";
}

export function HospitalAnnouncements() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);

	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get("/api/patient/announcements");
				setAnnouncements(response.data.announcements);
			} catch (err) {
				console.error("Error fetching hospital announcements:", err);
				setError("Failed to load announcements");
			} finally {
				setLoading(false);
			}
		};

		fetchAnnouncements();
	}, []);

	const getAnnouncementTypeColor = (type: string) => {
		switch (type) {
			case "emergency":
				return "bg-red-100 text-red-800 border-red-200";
			case "covid":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "service":
				return "bg-blue-100 text-blue-800 border-blue-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold flex items-center">
						<Megaphone className="h-5 w-5 mr-2 text-red-500" />
						Hospital Announcements
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						{[1, 2].map((i) => (
							<div key={i} className="flex flex-col space-y-2">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="text-center text-red-500 py-4">
						{error}. Please try refreshing the page.
					</div>
				) : announcements.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						No announcements at this time.
					</div>
				) : (
					<div className="space-y-4">
						{announcements.map((announcement) => (
							<div key={announcement._id} className="p-3 bg-gray-50 rounded-lg">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-medium text-gray-900">
											{announcement.title}
										</h3>
										<Badge
											variant="outline"
											className={`mt-1 ${getAnnouncementTypeColor(
												announcement.type
											)}`}
										>
											{announcement.type.charAt(0).toUpperCase() +
												announcement.type.slice(1)}
										</Badge>
									</div>
									<div className="flex items-center text-xs text-gray-500">
										<Calendar className="h-3 w-3 mr-1" />
										{new Date(announcement.date).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</div>
								</div>
								<p className="mt-2 text-sm text-gray-600">
									{announcement.content}
								</p>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
