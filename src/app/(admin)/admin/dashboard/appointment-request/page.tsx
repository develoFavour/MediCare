"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
	Calendar,
	FileText,
	CheckCircle,
	XCircle,
	AlertCircle,
	RefreshCw,
	UserPlus,
	Loader2,
	Clock,
	Filter,
	Search,
	ChevronDown,
	MoreHorizontal,
	ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
		specialty?: string;
	};
	createdAt: string;
	priority?: "low" | "medium" | "high";
}

interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
}

export default function AppointmentRequestsPage() {
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
	const [activeTab, setActiveTab] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");
	const [searchTerm, setSearchTerm] = useState("");

	// Add some mock priority data for UI demonstration
	const enhanceRequestsWithPriority = (requests: AppointmentRequest[]) => {
		return requests.map((request) => ({
			...request,
			priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as
				| "low"
				| "medium"
				| "high",
		}));
	};

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
				// Add mock priority data
				setAppointmentRequests(enhanceRequestsWithPriority(data));
			} else {
				toast.error("Failed to fetch appointment requests");
			}
		} catch (error) {
			toast.error("An error occurred while fetching appointment requests");
			console.error(error);
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
			console.error(error);
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

	const filteredRequests = useMemo(() => {
		return appointmentRequests
			.filter((request) => {
				// Filter by tab/status
				if (activeTab !== "all" && request.status !== activeTab) {
					return false;
				}

				// Filter by search term
				if (
					searchTerm &&
					!request.userId?.fullName
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
				) {
					return false;
				}

				return true;
			})
			.sort((a, b) => {
				// Sort by priority (high to low) and then by date (newest first)
				const priorityOrder = { high: 0, medium: 1, low: 2 };
				const priorityDiff =
					(priorityOrder[a.priority || "low"] || 0) -
					(priorityOrder[b.priority || "low"] || 0);

				if (priorityDiff !== 0) return priorityDiff;

				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			});
	}, [appointmentRequests, activeTab, searchTerm]);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge
						variant="outline"
						className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800 flex items-center gap-1"
					>
						<AlertCircle className="h-3 w-3" />
						Pending
					</Badge>
				);
			case "approved":
				return (
					<Badge
						variant="outline"
						className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 flex items-center gap-1"
					>
						<CheckCircle className="h-3 w-3" />
						Approved
					</Badge>
				);
			case "rejected":
				return (
					<Badge
						variant="outline"
						className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800 flex items-center gap-1"
					>
						<XCircle className="h-3 w-3" />
						Rejected
					</Badge>
				);
			default:
				return null;
		}
	};

	const getPriorityBadge = (priority = "medium") => {
		switch (priority) {
			case "high":
				return (
					<Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
						High Priority
					</Badge>
				);
			case "medium":
				return (
					<Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
						Medium Priority
					</Badge>
				);
			case "low":
				return (
					<Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
						Low Priority
					</Badge>
				);
			default:
				return null;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "MMM d, yyyy 'at' h:mm a");
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	if (loading) {
		return (
			<div className="container mx-auto p-6 space-y-8">
				<div className="flex justify-between items-center mb-8">
					<div>
						<Skeleton className="h-10 w-64 mb-2" />
						<Skeleton className="h-5 w-96" />
					</div>
					<div className="flex gap-4">
						<Skeleton className="h-10 w-32" />
						<Skeleton className="h-10 w-40" />
					</div>
				</div>

				<Skeleton className="h-12 w-full mb-6" />

				<div className="space-y-6">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-64 w-full rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
						Appointment Requests
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="flex items-center gap-2">
								<Filter className="h-4 w-4" />
								Filter
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setActiveTab("all")}>
								All Requests
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setActiveTab("pending")}>
								Pending Only
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setActiveTab("approved")}>
								Approved Only
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setActiveTab("rejected")}>
								Rejected Only
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<GlassCard className="mb-8">
				<CardContent className="p-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								type="text"
								placeholder="Search by patient name"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Tabs
							value={activeTab}
							onValueChange={(value: any) => setActiveTab(value)}
							className="w-full md:w-auto"
						>
							<TabsList className="grid grid-cols-4 w-full md:w-[400px]">
								<TabsTrigger value="all" className="text-xs md:text-sm">
									All
								</TabsTrigger>
								<TabsTrigger value="pending" className="text-xs md:text-sm">
									Pending
								</TabsTrigger>
								<TabsTrigger value="approved" className="text-xs md:text-sm">
									Approved
								</TabsTrigger>
								<TabsTrigger value="rejected" className="text-xs md:text-sm">
									Rejected
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</CardContent>
			</GlassCard>

			{filteredRequests.length === 0 ? (
				<GlassCard className="p-8 text-center">
					<div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
						<ClipboardList className="h-8 w-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
						No appointment requests found
					</h3>
					<p className="text-gray-500 dark:text-gray-400 mb-4">
						There are no appointment requests matching your filter criteria.
					</p>
					<Button
						onClick={() => {
							setActiveTab("all");
							setSearchTerm("");
						}}
					>
						Clear Filters
					</Button>
				</GlassCard>
			) : (
				<div className="grid grid-cols-1 gap-6">
					<AnimatePresence>
						{filteredRequests.map((request, index) => (
							<motion.div
								key={request._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
							>
								<GlassCard className="overflow-hidden border-gray-100 hover:shadow-md transition-shadow duration-300">
									<CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 pb-4">
										<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
													<AvatarFallback className="bg-[#116aef] text-white">
														{getInitials(request.userId?.fullName || "User")}
													</AvatarFallback>
												</Avatar>
												<div>
													<CardTitle className="text-xl text-gray-800 dark:text-gray-100">
														{request.userId?.fullName}
													</CardTitle>
													<div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
														<div className="flex items-center">
															<Calendar className="h-4 w-4 mr-1" />
															<span>{formatDate(request.createdAt)}</span>
														</div>
														{getPriorityBadge(request.priority)}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												{getStatusBadge(request.status)}
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => {
																// View patient details
																// This would navigate to patient details page
																toast.success("Viewing patient details");
															}}
														>
															View Patient Details
														</DropdownMenuItem>
														{request.status === "pending" && (
															<>
																<DropdownMenuItem
																	onClick={() => {
																		if (selectedDoctors[request._id]) {
																			handleApproveRequest(request._id);
																		} else {
																			toast.error(
																				"Please select a doctor first"
																			);
																		}
																	}}
																>
																	Approve Request
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		handleRejectRequest(request._id)
																	}
																>
																	Reject Request
																</DropdownMenuItem>
															</>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</CardHeader>
									<CardContent className="pt-6">
										<div className="mb-6">
											<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
												<FileText className="h-4 w-4 mr-2" />
												Symptoms
											</h3>
											<p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
												{request.symptoms}
											</p>
										</div>

										{request.assignedDoctor && (
											<div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
												<h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center">
													<UserPlus className="h-4 w-4 mr-2" />
													Assigned Doctor
												</h3>
												<p className="text-blue-800 dark:text-blue-200 font-medium">
													{request.assignedDoctor?.fullName}
													{request.assignedDoctor?.specialty && (
														<span className="text-blue-600 dark:text-blue-300 font-normal ml-2">
															({request.assignedDoctor.specialty})
														</span>
													)}
												</p>
											</div>
										)}

										{request.status === "pending" && (
											<div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
												<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
									<CardFooter className="bg-gray-50 dark:bg-gray-800/50 py-3 px-6 text-xs text-gray-500 dark:text-gray-400">
										<div className="flex items-center">
											<Clock className="h-3 w-3 mr-1" />
											Request ID: {request._id}
										</div>
									</CardFooter>
								</GlassCard>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}
