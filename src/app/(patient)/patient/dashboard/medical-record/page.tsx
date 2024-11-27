"use client";
import "@/app/(root)/globals.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, Search, Plus, Share2 } from "lucide-react";

interface MedicalRecord {
	id: string;
	type: string;
	date: string;
	doctor: string;
	description: string;
	fileUrl: string;
}

const sampleRecords: MedicalRecord[] = [
	{
		id: "1",
		type: "Lab Results",
		date: "2024-05-15",
		doctor: "Dr. Emily Johnson",
		description: "Complete Blood Count (CBC)",
		fileUrl: "/sample-files/cbc-results.pdf",
	},
	{
		id: "2",
		type: "Imaging",
		date: "2024-04-20",
		doctor: "Dr. Michael Lee",
		description: "Chest X-Ray",
		fileUrl: "/sample-files/chest-xray.pdf",
	},
	{
		id: "3",
		type: "Prescription",
		date: "2024-06-01",
		doctor: "Dr. Sarah Parker",
		description: "Hypertension Medication",
		fileUrl: "/sample-files/prescription.pdf",
	},
	{
		id: "4",
		type: "Consultation Notes",
		date: "2024-05-28",
		doctor: "Dr. David Smith",
		description: "Annual Check-up",
		fileUrl: "/sample-files/consultation-notes.pdf",
	},
];

const categories = [
	"All",
	"Lab Results",
	"Imaging",
	"Prescriptions",
	"Consultation Notes",
];

export default function MedicalRecordPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");

	const filteredRecords = sampleRecords.filter(
		(record) =>
			(activeCategory === "All" || record.type === activeCategory) &&
			(record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
				record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
				record.description.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	return (
		<div className="min-h-screen bg-[#e9f2ff] p-6">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold text-[#116aef]">Medical Records</h1>
				<div className="flex gap-3">
					<Button variant="outline" className="bg-white text-[#116aef]">
						<Share2 className="mr-2 h-4 w-4" />
						Share Records
					</Button>
					<Button className="bg-[#116aef] hover:bg-[#0f5ed8] text-white">
						<Plus className="mr-2 h-4 w-4" />
						Request Records
					</Button>
				</div>
			</div>

			<div className="relative mb-6">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
				<Input
					type="text"
					placeholder="Search records..."
					className="pl-10 bg-white border-0 h-12"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			<div className="bg-white rounded-lg p-1 mb-6">
				<div className="flex space-x-1">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setActiveCategory(category)}
							className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
								activeCategory === category
									? "bg-[#116aef] text-white"
									: "text-gray-600 hover:bg-gray-50"
							}`}
						>
							{category}
						</button>
					))}
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredRecords.map((record) => (
					<div
						key={record.id}
						className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
					>
						<div className="flex items-start gap-3 mb-4">
							<div className="p-2 bg-[#e9f2ff] rounded-lg">
								<FileText className="h-5 w-5 text-[#116aef]" />
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-gray-900">{record.type}</h3>
								<p className="text-sm text-gray-500">{record.date}</p>
							</div>
						</div>
						<p className="text-sm text-gray-600 mb-4">{record.description}</p>
						<div className="flex items-center gap-2 mb-4">
							<Avatar className="h-8 w-8">
								<AvatarImage src="/img/avatar.jpg" alt={record.doctor} />
								<AvatarFallback>{record.doctor[0]}</AvatarFallback>
							</Avatar>
							<span className="text-sm text-gray-600">{record.doctor}</span>
						</div>
						<Button variant="outline" className="w-full">
							<Download className="mr-2 h-4 w-4" />
							Download
						</Button>
					</div>
				))}
			</div>

			{filteredRecords.length === 0 && (
				<div className="text-center py-12 bg-white rounded-lg">
					<FileText className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-2 text-lg font-medium text-gray-900">
						No records found
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						Try adjusting your search or filters to find what you&apos;re
						looking for.
					</p>
				</div>
			)}
		</div>
	);
}
