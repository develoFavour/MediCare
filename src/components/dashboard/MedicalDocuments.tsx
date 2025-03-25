"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Calendar, Search, Upload, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Document {
	_id: string;
	title: string;
	type: "prescription" | "lab_result" | "medical_report" | "referral" | "other";
	date: string;
	doctor: {
		_id: string;
		fullName: string;
	};
	fileUrl: string;
	description?: string;
}

export function MedicalDocuments() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [documents, setDocuments] = useState<Document[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get("/api/patient/documents");
				setDocuments(response.data.documents);
			} catch (err) {
				console.error("Error fetching medical documents:", err);
				setError("Failed to load documents");
			} finally {
				setLoading(false);
			}
		};

		fetchDocuments();
	}, []);

	const getDocumentTypeColor = (type: string) => {
		switch (type) {
			case "prescription":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "lab_result":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "medical_report":
				return "bg-green-100 text-green-800 border-green-200";
			case "referral":
				return "bg-amber-100 text-amber-800 border-amber-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getDocumentTypeLabel = (type: string) => {
		switch (type) {
			case "lab_result":
				return "Lab Result";
			case "medical_report":
				return "Medical Report";
			default:
				return type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");
		}
	};

	// Filter documents
	const filteredDocuments = documents.filter((doc) => {
		// Search term filter
		const matchesSearch =
			searchTerm === "" ||
			doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doc.doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(doc.description &&
				doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

		// Type filter
		const matchesType = typeFilter === "all" || doc.type === typeFilter;

		return matchesSearch && matchesType;
	});

	const handleDownload = (fileUrl: string) => {
		window.open(fileUrl, "_blank");
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold">
						Medical Documents
					</CardTitle>
					<Button onClick={() => router.push("/patient/documents/upload")}>
						<Upload className="mr-2 h-4 w-4" /> Upload Document
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="mb-6 space-y-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search documents..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select value={typeFilter} onValueChange={setTypeFilter}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="prescription">Prescriptions</SelectItem>
							<SelectItem value="lab_result">Lab Results</SelectItem>
							<SelectItem value="medical_report">Medical Reports</SelectItem>
							<SelectItem value="referral">Referrals</SelectItem>
							<SelectItem value="other">Other</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{loading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex justify-between items-center">
								<div className="space-y-2">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-4 w-24" />
								</div>
								<Skeleton className="h-9 w-24" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="text-center text-red-500 py-4">
						{error}. Please try refreshing the page.
					</div>
				) : filteredDocuments.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						<p className="mb-4">No medical documents found.</p>
						<Button
							variant="outline"
							onClick={() => router.push("/patient/documents/upload")}
						>
							<Upload className="mr-2 h-4 w-4" /> Upload Your First Document
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{filteredDocuments.map((document) => (
							<div key={document._id} className="p-4 bg-gray-50 rounded-lg">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
									<div>
										<h3 className="font-medium text-gray-900">
											{document.title}
										</h3>
										<div className="flex flex-wrap gap-2 mt-1">
											<Badge
												variant="outline"
												className={getDocumentTypeColor(document.type)}
											>
												{getDocumentTypeLabel(document.type)}
											</Badge>
											<div className="flex items-center text-xs text-gray-500">
												<Calendar className="h-3 w-3 mr-1" />
												{new Date(document.date).toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})}
											</div>
										</div>
										<p className="text-sm text-gray-600 mt-1">
											Doctor: {document.doctor.fullName}
										</p>
										{document.description && (
											<p className="text-sm text-gray-600 mt-1 line-clamp-2">
												{document.description}
											</p>
										)}
									</div>
									<div className="flex gap-2 mt-3 sm:mt-0">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												router.push(`/patient/documents/${document._id}`)
											}
										>
											<Eye className="mr-2 h-4 w-4" />
											View
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDownload(document.fileUrl)}
										>
											<Download className="mr-2 h-4 w-4" />
											Download
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
