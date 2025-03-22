export interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
}

export interface Appointment {
	_id: string;
	doctorId: Doctor | null;
	date: string;
	reason: string;
	status: "scheduled" | "canceled" | "completed";
}

export interface Patient {
	_id: string;
	fullName: string;
	email: string;
	isApproved: boolean;
	assignedDoctor: Doctor | null;
	appointments: Appointment[];
}
