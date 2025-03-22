import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Award, MapPin, Star } from "lucide-react";

interface DoctorProps {
	doctor: {
		_id: string;
		fullName: string;
		email: string;
		specialty: string;
		age: number;
		gender: string;
		image?: string;
		patients?: number;
		rating?: number;
		experience?: number;
		location?: string;
	};
}

export default function Doctor({ doctor }: DoctorProps) {
	const {
		fullName,
		specialty,
		image,
		patients = 0,
		experience = 0,
		rating = 0,
		location = "New York",
	} = doctor;

	const getUserInitials = (name: string) => {
		if (!name) return "";
		const names = name.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	return (
		<Card className="w-full bg-white border-[#E3F2FD] hover:shadow-md transition-shadow duration-300">
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#4B8BF7]">
						{image ? (
							<Image
								src={image || "/placeholder.svg"}
								alt={`${fullName} avatar`}
								height={64}
								width={64}
								className="object-cover h-full w-full"
							/>
						) : (
							<div className="h-full w-full flex items-center justify-center bg-[#E3F2FD] text-[#1565C0] font-bold text-xl">
								{getUserInitials(fullName)}
							</div>
						)}
					</div>

					<div className="flex-1">
						<div className="flex justify-between items-start">
							<div>
								<h3 className="text-lg font-semibold text-[#1565C0]">
									{fullName}
								</h3>
								<Badge
									variant="secondary"
									className="mt-1 bg-[#E3F2FD] text-[#1565C0]"
								>
									{specialty}
								</Badge>
							</div>
							<div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
								<Star className="h-3 w-3 text-yellow-500 mr-1" />
								<span className="text-xs font-medium text-yellow-700">
									{rating.toFixed(1)}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
					<div className="flex items-center text-[#4B8BF7]">
						<Clock className="mr-2 h-4 w-4" />
						<span>Available Today</span>
					</div>
					<div className="flex items-center text-[#4B8BF7]">
						<Users className="mr-2 h-4 w-4" />
						<span>{patients} Patients</span>
					</div>
					<div className="flex items-center text-[#4B8BF7]">
						<Award className="mr-2 h-4 w-4" />
						<span>{experience} Years Exp.</span>
					</div>
					<div className="flex items-center text-[#4B8BF7]">
						<MapPin className="mr-2 h-4 w-4" />
						<span>{location}</span>
					</div>
				</div>

				<div className="mt-4 flex justify-end space-x-2">
					<Button
						variant="outline"
						size="sm"
						className="border-[#4B8BF7] text-[#4B8BF7] hover:bg-[#E3F2FD]"
					>
						View Profile
					</Button>
					<Button
						size="sm"
						className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white"
					>
						Book Appointment
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
