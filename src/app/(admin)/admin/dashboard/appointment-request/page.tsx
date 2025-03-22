"use client";

import { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
	Calendar,
	User,
	FileText,
	CheckCircle,
	XCircle,
	AlertCircle,
	RefreshCw,
	UserPlus,
	Loader2,
} from "lucide-react";

interface AppointmentRequest {
	_id: string;
	userId: {
		_id: string;
		fullName: string;
	};
	symptoms: string;
	status: "pending" | "approved" | "rejected";
	assignedDoctor?: {
		_id: string;
		fullName: string;
	};
	createdAt: string;
}

interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
}

export default function AdminAppointmentRequests() {
	const [appointmentRequests, setAppointmentRequests] = useState<
		AppointmentRequest[]
	>([]);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const [processingRequests, setProcessingRequests] = useState<{
		[key: string]: boolean;
	}>({});
	const [selectedDoctors, setSelectedDoctors] = useState<{
		[key: string]: string;
	}>({});
	const [filter, setFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");

	useEffect(() => {
		fetchAppointmentRequests();
		fetchDoctors();
	}, []);

	const fetchAppointmentRequests = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/admin/appointment-requests");
			if (response.ok) {
				const data = await response.json();
				setAppointmentRequests(data);
			} else {
				toast.error("Failed to fetch appointment requests");
			}
		} catch (error) {
			toast.error("An error occurred while fetching appointment requests");
		} finally {
			setLoading(false);
		}
	};

	const fetchDoctors = async () => {
		try {
			const response = await fetch("/api/admin/admin-doctors");
			if (response.ok) {
				const data = await response.json();
				setDoctors(data);
			} else {
				toast.error("Failed to fetch doctors");
			}
		} catch (error) {
			toast.error("An error occurred while fetching doctors");
		}
	};

	const handleSelectDoctor = (requestId: string, doctorId: string) => {
		setSelectedDoctors((prev) => ({ ...prev, [requestId]: doctorId }));
	};

	const handleApproveRequest = async (requestId: string) => {
		const doctorId = selectedDoctors[requestId];
		if (!doctorId) {
			toast.error("Please select a doctor before approving");
			return;
		}

		setProcessingRequests((prev) => ({ ...prev, [requestId]: true }));

		try {
			const response = await fetch(
				`/api/admin/appointment-requests/${requestId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ doctorId, status: "approved" }),
				}
			);

			if (response.ok) {
				toast.success("Doctor assigned and request approved successfully");
				fetchAppointmentRequests();
			} else {
				toast.error("Failed to assign doctor and approve request");
			}
		} catch (error) {
			toast.error(
				"An error occurred while assigning the doctor and approving the request"
			);
		} finally {
			setProcessingRequests((prev) => ({ ...prev, [requestId]: false }));
		}
	};

	const handleRejectRequest = async (requestId: string) => {
		setProcessingRequests((prev) => ({ ...prev, [requestId]: true }));

		try {
			const response = await fetch(
				`/api/admin/appointment-requests/${requestId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "rejected" }),
				}
			);

			if (response.ok) {
				toast.success("Request rejected successfully");
				fetchAppointmentRequests();
			} else {
				toast.error("Failed to reject request");
			}
		} catch (error) {
			toast.error("An error occurred while rejecting the request");
		} finally {
			setProcessingRequests((prev) => ({ ...prev, [requestId]: false }));
		}
	};

	const filteredRequests = appointmentRequests.filter((request) => {
		if (filter === "all") return true;
		return request.status === filter;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge
						variant="outline"
						className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
					>
						<AlertCircle className="h-3 w-3" />
						Pending
					</Badge>
				);
			case "approved":
				return (
					<Badge
						variant="outline"
						className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
					>
						<CheckCircle className="h-3 w-3" />
						Approved
					</Badge>
				);
			case "rejected":
				return (
					<Badge
						variant="outline"
						className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
					>
						<XCircle className="h-3 w-3" />
						Rejected
					</Badge>
				);
			default:
				return null;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<Loader2 className="h-12 w-12 text-[#116aef] animate-spin mb-4" />
				<h3 className="text-xl font-medium text-gray-700">
					Loading appointment requests...
				</h3>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Appointment Requests
					</h1>
					<p className="text-gray-500">
						Manage and assign doctors to patient appointment requests
					</p>
				</div>
				<div className="flex items-center space-x-4 mt-4 md:mt-0">
					<Button
						variant="outline"
						onClick={fetchAppointmentRequests}
						className="flex items-center gap-2"
					>
						<RefreshCw className="h-4 w-4" />
						Refresh
					</Button>
					<Select
						value={filter}
						onValueChange={(value: any) => setFilter(value)}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Requests</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{filteredRequests.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
					<div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
						<FileText className="h-8 w-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						No appointment requests found
					</h3>
					<p className="text-gray-500 mb-4">
						There are no appointment requests matching your filter criteria.
					</p>
					<Button onClick={() => setFilter("all")}>View All Requests</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6">
					<AnimatePresence>
						{filteredRequests.map((request) => (
							<motion.div
								key={request._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<Card className="overflow-hidden border-gray-100 hover:shadow-md transition-shadow duration-300">
									<CardHeader className="bg-gray-50 pb-4">
										<div className="flex justify-between items-start">
											<div className="flex items-center gap-3">
												<div className="bg-[#116aef] text-white p-2 rounded-full">
													<User className="h-5 w-5" />
												</div>
												<div>
													<CardTitle className="text-xl">
														{request.userId?.fullName}
													</CardTitle>
													<div className="flex items-center text-sm text-gray-500 mt-1">
														<Calendar className="h-4 w-4 mr-1" />
														<span>{formatDate(request.createdAt)}</span>
													</div>
												</div>
											</div>
											{getStatusBadge(request.status)}
										</div>
									</CardHeader>
									<CardContent className="pt-6">
										<div className="mb-6">
											<h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
												<FileText className="h-4 w-4 mr-2" />
												Symptoms
											</h3>
											<p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
												{request.symptoms}
											</p>
										</div>

										{request.assignedDoctor && (
											<div className="mb-6 bg-blue-50 p-4 rounded-lg">
												<h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
													<UserPlus className="h-4 w-4 mr-2" />
													Assigned Doctor
												</h3>
												<p className="text-blue-800 font-medium">
													{request.assignedDoctor?.fullName}
												</p>
											</div>
										)}

										{request.status === "pending" && (
											<div className="border-t pt-4 mt-4">
												<h3 className="text-sm font-medium text-gray-700 mb-3">
													Assign Doctor
												</h3>
												<div className="flex flex-col sm:flex-row gap-3">
													<Select
														value={selectedDoctors[request._id] || ""}
														onValueChange={(value) =>
															handleSelectDoctor(request._id, value)
														}
													>
														<SelectTrigger className="w-full sm:w-64">
															<SelectValue placeholder="Select a doctor" />
														</SelectTrigger>
														<SelectContent>
															{doctors.map((doctor) => (
																<SelectItem key={doctor._id} value={doctor._id}>
																	{doctor?.fullName} - {doctor.specialty}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<div className="flex gap-2">
														<Button
															onClick={() => handleApproveRequest(request._id)}
															className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
															disabled={
																processingRequests[request._id] ||
																!selectedDoctors[request._id]
															}
														>
															{processingRequests[request._id] ? (
																<>
																	<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																	Processing...
																</>
															) : (
																<>
																	<CheckCircle className="mr-2 h-4 w-4" />
																	Approve
																</>
															)}
														</Button>
														<Button
															onClick={() => handleRejectRequest(request._id)}
															variant="destructive"
															className="flex-1 sm:flex-none"
															disabled={processingRequests[request._id]}
														>
															{processingRequests[request._id] ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<>
																	<XCircle className="mr-2 h-4 w-4" />
																	Reject
																</>
															)}
														</Button>
													</div>
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}
			<Toaster position="top-right" />
		</div>
	);
}
