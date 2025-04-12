import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface PatientMedicalRecordsProps {
	patientId: string;
}

export function PatientMedicalRecords({
	patientId,
}: PatientMedicalRecordsProps) {
	// This is a placeholder component - in a real application, you would fetch medical records
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle>Medical Records</CardTitle>
				<CardDescription>Patient medical history and documents</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<EmptyState
					icon={<FileText className="h-12 w-12 text-muted-foreground" />}
					title="No Medical Records"
					description="This patient doesn't have any medical records in the system yet."
				/>
			</CardContent>
		</Card>
	);
}
