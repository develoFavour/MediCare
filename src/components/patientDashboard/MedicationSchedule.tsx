import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Pill } from "lucide-react";

interface Medication {
	id: string;
	name: string;
	dosage: string;
	frequency: string;
	time: string;
}

export function MedicationSchedule({
	medications,
}: {
	medications: Medication[];
}) {
	return (
		<Card className="bg-white shadow-md">
			<CardHeader className="bg-[#116aef] text-white">
				<CardTitle className="text-lg font-semibold flex items-center">
					<Pill className="w-5 h-5 mr-2" />
					Medication Schedule
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-[#116aef]">Medication</TableHead>
							<TableHead className="text-[#116aef]">Dosage</TableHead>
							<TableHead className="text-[#116aef]">Frequency</TableHead>
							<TableHead className="text-[#116aef]">Time</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{medications.map((med) => (
							<TableRow key={med.id}>
								<TableCell className="font-medium">{med.name}</TableCell>
								<TableCell>{med.dosage}</TableCell>
								<TableCell>{med.frequency}</TableCell>
								<TableCell>{med.time}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
