"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-hot-toast";
import {
	Mic,
	MicOff,
	Camera,
	CameraOff,
	PhoneOff,
	Send,
	Monitor,
	FileText,
	Clock,
	MessageSquare,
} from "lucide-react";

interface VideoConsultationProps {
	appointmentId: string;
	patientId?: string;
	doctorId?: string;
	isDoctor: boolean;
}

interface Participant {
	id: string;
	name: string;
	profileImage?: string;
	role: "doctor" | "patient";
}

interface Message {
	id: string;
	sender: string;
	text: string;
	timestamp: Date;
}

interface AppointmentDetails {
	_id: string;
	date: string;
	reason: string;
	notes?: string;
	type: "in-person" | "virtual";
	status: "scheduled" | "completed" | "cancelled";
	userId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
	};
	doctorId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
		specialization?: string;
	};
}

export default function VideoConsultation({
	appointmentId,
	patientId,
	doctorId,
	isDoctor,
}: VideoConsultationProps) {
	const router = useRouter();
	const [appointment, setAppointment] = useState<AppointmentDetails | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [isMicOn, setIsMicOn] = useState(false);
	const [isCameraOn, setIsCameraOn] = useState(false);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [activeTab, setActiveTab] = useState("video");
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [medicalNotes, setMedicalNotes] = useState("");
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Fetch appointment details
	useEffect(() => {
		const fetchAppointmentDetails = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/appointments/${appointmentId}`);

				if (!response.ok) {
					throw new Error("Failed to fetch appointment details");
				}

				const data = await response.json();
				if (data.success && data.appointment) {
					setAppointment(data.appointment);

					// Pre-fill medical notes if doctor and notes exist
					if (isDoctor && data.appointment.notes) {
						setMedicalNotes(data.appointment.notes);
					}
				} else {
					toast.error("Appointment not found");
					router.back();
				}
			} catch (error) {
				console.error("Error fetching appointment details:", error);
				toast.error("Failed to load appointment details");
			} finally {
				setLoading(false);
			}
		};

		fetchAppointmentDetails();
	}, [appointmentId, router, isDoctor]);

	// Scroll to bottom of messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Mock function to simulate starting camera/mic
	const startMedia = async (type: "camera" | "mic") => {
		try {
			const constraints = {
				audio: type === "mic",
				video: type === "camera",
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			if (type === "camera") {
				setIsCameraOn(true);
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}
			} else {
				setIsMicOn(true);
			}

			toast.success(`${type === "camera" ? "Camera" : "Microphone"} turned on`);
		} catch (error) {
			console.error(`Error accessing ${type}:`, error);
			toast.error(
				`Could not access your ${type === "camera" ? "camera" : "microphone"}`
			);
		}
	};

	// Mock function to simulate stopping camera/mic
	const stopMedia = (type: "camera" | "mic") => {
		if (type === "camera") {
			if (localVideoRef.current && localVideoRef.current.srcObject) {
				const stream = localVideoRef.current.srcObject as MediaStream;
				stream.getTracks().forEach((track) => track.stop());
				localVideoRef.current.srcObject = null;
			}
			setIsCameraOn(false);
		} else {
			setIsMicOn(false);
		}

		toast.success(`${type === "camera" ? "Camera" : "Microphone"} turned off`);
	};

	// Mock function to simulate screen sharing
	const toggleScreenShare = async () => {
		try {
			if (!isScreenSharing) {
				const stream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
				});
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}
				setIsScreenSharing(true);
				toast.success("Screen sharing started");
			} else {
				if (localVideoRef.current && localVideoRef.current.srcObject) {
					const stream = localVideoRef.current.srcObject as MediaStream;
					stream.getTracks().forEach((track) => track.stop());
				}
				setIsScreenSharing(false);

				// Restore camera if it was on
				if (isCameraOn) {
					const cameraStream = await navigator.mediaDevices.getUserMedia({
						video: true,
					});
					if (localVideoRef.current) {
						localVideoRef.current.srcObject = cameraStream;
					}
				} else {
					if (localVideoRef.current) {
						localVideoRef.current.srcObject = null;
					}
				}

				toast.success("Screen sharing stopped");
			}
		} catch (error) {
			console.error("Error toggling screen share:", error);
			toast.error("Could not share your screen");
		}
	};

	// Send a chat message
	const sendMessage = () => {
		if (!newMessage.trim()) return;

		const messageObj: Message = {
			id: Date.now().toString(),
			sender: isDoctor ? "doctor" : "patient",
			text: newMessage,
			timestamp: new Date(),
		};

		setMessages([...messages, messageObj]);
		setNewMessage("");
	};

	// Save medical notes
	const saveNotes = async () => {
		if (!appointment) return;

		try {
			const response = await fetch(`/api/appointments/${appointmentId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ notes: medicalNotes }),
			});

			if (!response.ok) {
				throw new Error("Failed to save notes");
			}

			toast.success("Medical notes saved successfully");
		} catch (error) {
			console.error("Error saving notes:", error);
			toast.error("Failed to save notes");
		}
	};

	// End the call
	const endCall = async () => {
		// Stop all media tracks
		if (localVideoRef.current && localVideoRef.current.srcObject) {
			const stream = localVideoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
		}

		// If doctor, save notes and mark appointment as completed
		if (isDoctor) {
			try {
				await saveNotes();

				const response = await fetch(`/api/appointments/${appointmentId}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "completed" }),
				});

				if (!response.ok) {
					throw new Error("Failed to update appointment status");
				}
			} catch (error) {
				console.error("Error updating appointment:", error);
			}
		}

		// Redirect back to appointments page
		const redirectPath = isDoctor
			? `/doctor/dashboard/appointments/${appointmentId}`
			: `/patient/dashboard/upcoming-appointments/${appointmentId}`;

		router.push(redirectPath);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-gray-600">Loading video consultation...</p>
				</div>
			</div>
		);
	}

	if (!appointment) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold mb-2">Appointment Not Found</h2>
				<p className="text-gray-600 mb-4">
					This appointment doesn&apos;t exist or you don&apos;t have permission
					to access it.
				</p>
				<Button onClick={() => router.back()}>Go Back</Button>
			</div>
		);
	}

	const otherParticipant = isDoctor ? appointment.userId : appointment.doctorId;

	return (
		<div className="container mx-auto py-4 px-4">
			<div className="flex flex-col space-y-4">
				{/* Header with appointment info */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
					<div>
						<h1 className="text-2xl font-bold">Video Consultation</h1>
						<p className="text-gray-600">
							{isDoctor
								? `With ${appointment.userId.fullName}`
								: `With Dr. ${appointment.doctorId.fullName}`}
						</p>
					</div>
					<div className="flex items-center mt-2 md:mt-0">
						<Clock className="h-4 w-4 text-gray-500 mr-2" />
						<span className="text-sm text-gray-600">
							Call started at {new Date().toLocaleTimeString()}
						</span>
					</div>
				</div>

				{/* Main content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{/* Video and controls - takes 2/3 of the space on large screens */}
					<div className="lg:col-span-2">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="video">Video</TabsTrigger>
								<TabsTrigger value="chat">Chat</TabsTrigger>
								{isDoctor && (
									<TabsTrigger value="notes">Medical Notes</TabsTrigger>
								)}
							</TabsList>

							<TabsContent value="video" className="mt-2">
								<Card className="border-0 shadow-sm">
									<CardContent className="p-0 relative">
										{/* Main video (remote participant) */}
										<div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
											<video
												ref={remoteVideoRef}
												autoPlay
												playsInline
												className="w-full h-full object-cover"
											/>

											{/* Placeholder when no remote video */}
											<div className="absolute inset-0 flex flex-col items-center justify-center text-white">
												<Avatar className="h-24 w-24 mb-4">
													<AvatarImage
														src={
															otherParticipant.profileImage ||
															"/placeholder.svg"
														}
													/>
													<AvatarFallback className="text-2xl">
														{otherParticipant.fullName
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<p className="text-xl font-medium">
													{isDoctor
														? appointment.userId.fullName
														: `Dr. ${appointment.doctorId.fullName}`}
												</p>
												<p className="text-gray-300 mt-2">Connecting...</p>
											</div>

											{/* Self view (picture-in-picture) */}
											<div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
												<video
													ref={localVideoRef}
													autoPlay
													playsInline
													muted
													className="w-full h-full object-cover"
												/>

												{/* Placeholder when camera is off */}
												{!isCameraOn && (
													<div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
														<Avatar className="h-10 w-10">
															<AvatarFallback>You</AvatarFallback>
														</Avatar>
													</div>
												)}
											</div>
										</div>
									</CardContent>

									<CardFooter className="flex justify-center py-4 space-x-4">
										<Button
											variant={isMicOn ? "default" : "outline"}
											size="icon"
											onClick={() =>
												isMicOn ? stopMedia("mic") : startMedia("mic")
											}
											className={
												isMicOn ? "bg-primary hover:bg-primary/90" : ""
											}
										>
											{isMicOn ? (
												<Mic className="h-5 w-5" />
											) : (
												<MicOff className="h-5 w-5" />
											)}
										</Button>

										<Button
											variant={isCameraOn ? "default" : "outline"}
											size="icon"
											onClick={() =>
												isCameraOn ? stopMedia("camera") : startMedia("camera")
											}
											className={
												isCameraOn ? "bg-primary hover:bg-primary/90" : ""
											}
										>
											{isCameraOn ? (
												<Camera className="h-5 w-5" />
											) : (
												<CameraOff className="h-5 w-5" />
											)}
										</Button>

										<Button
											variant={isScreenSharing ? "default" : "outline"}
											size="icon"
											onClick={toggleScreenShare}
											className={
												isScreenSharing
													? "bg-indigo-600 hover:bg-indigo-700"
													: ""
											}
										>
											<Monitor className="h-5 w-5" />
										</Button>

										<Button variant="destructive" size="icon" onClick={endCall}>
											<PhoneOff className="h-5 w-5" />
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>

							<TabsContent value="chat" className="mt-2">
								<Card className="border-0 shadow-sm">
									<CardHeader className="pb-2">
										<CardTitle className="text-lg flex items-center">
											<MessageSquare className="h-5 w-5 mr-2" />
											Chat
										</CardTitle>
									</CardHeader>

									<CardContent>
										<ScrollArea className="h-[400px] pr-4">
											{messages.length === 0 ? (
												<div className="text-center py-8 text-gray-500">
													<MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
													<p>No messages yet</p>
													<p className="text-sm">
														Send a message to start the conversation
													</p>
												</div>
											) : (
												<div className="space-y-4">
													{messages.map((msg) => (
														<div
															key={msg.id}
															className={`flex ${msg.sender === (isDoctor ? "doctor" : "patient") ? "justify-end" : "justify-start"}`}
														>
															<div
																className={`max-w-[80%] rounded-lg px-4 py-2 ${
																	msg.sender ===
																	(isDoctor ? "doctor" : "patient")
																		? "bg-primary text-white"
																		: "bg-gray-100 text-gray-800"
																}`}
															>
																<p>{msg.text}</p>
																<p className="text-xs opacity-70 mt-1">
																	{msg.timestamp.toLocaleTimeString([], {
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</p>
															</div>
														</div>
													))}
													<div ref={messagesEndRef} />
												</div>
											)}
										</ScrollArea>
									</CardContent>

									<CardFooter>
										<div className="flex w-full space-x-2">
											<Input
												placeholder="Type a message..."
												value={newMessage}
												onChange={(e) => setNewMessage(e.target.value)}
												onKeyDown={(e) => e.key === "Enter" && sendMessage()}
												className="flex-1"
											/>
											<Button onClick={sendMessage} type="submit">
												<Send className="h-4 w-4" />
											</Button>
										</div>
									</CardFooter>
								</Card>
							</TabsContent>

							{isDoctor && (
								<TabsContent value="notes" className="mt-2">
									<Card className="border-0 shadow-sm">
										<CardHeader className="pb-2">
											<CardTitle className="text-lg flex items-center">
												<FileText className="h-5 w-5 mr-2" />
												Medical Notes
											</CardTitle>
										</CardHeader>

										<CardContent>
											<Textarea
												placeholder="Enter medical notes, observations, and follow-up instructions..."
												value={medicalNotes}
												onChange={(e) => setMedicalNotes(e.target.value)}
												className="min-h-[300px]"
											/>
										</CardContent>

										<CardFooter className="flex justify-end">
											<Button onClick={saveNotes}>Save Notes</Button>
										</CardFooter>
									</Card>
								</TabsContent>
							)}
						</Tabs>
					</div>

					{/* Sidebar with appointment details - takes 1/3 of the space */}
					<div className="lg:col-span-1">
						<Card className="border-0 shadow-sm h-full">
							<CardHeader>
								<CardTitle className="text-lg">Appointment Details</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500 mb-1">
										Patient
									</h3>
									<div className="flex items-center space-x-3">
										<Avatar>
											<AvatarImage
												src={
													appointment.userId.profileImage || "/placeholder.svg"
												}
											/>
											<AvatarFallback>
												{appointment.userId.fullName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">
												{appointment.userId.fullName}
											</p>
											<p className="text-sm text-gray-500">
												{appointment.userId.email}
											</p>
										</div>
									</div>
								</div>

								<div>
									<h3 className="text-sm font-medium text-gray-500 mb-1">
										Doctor
									</h3>
									<div className="flex items-center space-x-3">
										<Avatar>
											<AvatarImage
												src={
													appointment.doctorId.profileImage ||
													"/placeholder.svg"
												}
											/>
											<AvatarFallback>
												{appointment.doctorId.fullName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">
												Dr. {appointment.doctorId.fullName}
											</p>
											{appointment.doctorId.specialization && (
												<p className="text-sm text-gray-500">
													{appointment.doctorId.specialization}
												</p>
											)}
										</div>
									</div>
								</div>

								<Separator />

								<div>
									<h3 className="text-sm font-medium text-gray-500 mb-1">
										Reason for Visit
									</h3>
									<p className="text-sm">
										{appointment.reason || "No reason provided"}
									</p>
								</div>

								{appointment.notes && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 mb-1">
											Previous Notes
										</h3>
										<p className="text-sm">{appointment.notes}</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
