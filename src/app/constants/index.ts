import {
	CalendarIcon,
	FileTextIcon,
	HomeIcon,
	MessageCircleIcon,
	PhoneIcon,
	VideoIcon,
	XCircleIcon,
	BotMessageSquare,
	SquarePlus,
	UserIcon,
	Users,
	PlusCircle,
	BedDouble,
	ClipboardList,
	DoorOpen,
	Stethoscope,
	SettingsIcon,
} from "lucide-react";
export const clientNavItems = [
	{ href: "/patient/dashboard", icon: HomeIcon, label: "Home" },
	{
		href: "/patient/dashboard/appointment",
		icon: SquarePlus,
		label: "New Appointment",
	},
	{
		href: "/patient/dashboard/upcoming-appointments",
		icon: CalendarIcon,
		label: "Upcoming Appointments",
	},
	{
		href: "/patient/dashboard/cancelled-appointments",
		icon: XCircleIcon,
		label: "Cancelled Appointments",
	},
	{
		href: "/patient/dashboard/prescriptions",
		icon: FileTextIcon,
		label: "Your Prescriptions",
	},

	{
		href: "/patient/dashboard/settings",
		icon: SettingsIcon,
		label: "Settings",
	},
];
export const adminNavItems = [
	{ href: "/admin/dashboard", icon: HomeIcon, label: "Home" },

	{
		href: "/admin/dashboard/doctors",
		icon: Stethoscope,
		label: "Doctors",
		subItems: [
			{
				href: "/admin/dashboard/doctors/doctors-list",
				icon: ClipboardList,
				label: "Doctors List",
			},
			{
				href: "/admin/dashboard/doctors/add-doctor",
				icon: PlusCircle,
				label: "Add Doctor",
			},
		],
	},
	{
		href: "/admin/dashboard/staffs",
		// icon:
	},
	{
		href: "/admin/dashboard/patients",
		icon: Users,
		label: "Patients",
		subItems: [
			{
				href: "/admin/dashboard/patients/patients-list",
				icon: ClipboardList,
				label: "Patients List",
			},
		],
	},
	{
		href: "/admin/dashboard/messages",
		icon: MessageCircleIcon,
		label: "Messages",
	},
	{
		href: "/admin/dashboard/rooms",
		icon: BedDouble,
		label: "Rooms",
		subItems: [
			{
				href: "/admin/dashboard/rooms/rooms-alloted",
				icon: ClipboardList,
				label: "Rooms Alloted",
			},
			{
				href: "/admin/dashboard/rooms/available-rooms",
				icon: DoorOpen,
				label: "Available Rooms",
			},
		],
	},
];
