import {
	Heart,
	Brain,
	Stethoscope,
	Pill,
	Bone,
	Eye,
	SmileIcon as Tooth,
	Baby,
	Microscope,
	Activity,
} from "lucide-react";
export const services = [
	{
		id: 1,
		title: "Cardiac Rehabilitation",
		category: "cardiology",
		description:
			"Comprehensive program to improve cardiovascular health after heart attack or surgery.",
		icon: Heart,
		image: "/placeholder.svg?height=400&width=600&text=Cardiac+Rehabilitation",
		features: [
			"Personalized exercise programs",
			"Nutrition counseling",
			"Stress management",
			"Education sessions",
		],
		popular: true,
	},
	{
		id: 2,
		title: "Neurological Disorders Treatment",
		category: "neurology",
		description:
			"Specialized care for conditions affecting the brain, spinal cord, and nervous system.",
		icon: Brain,
		image: "/placeholder.svg?height=400&width=600&text=Neurological+Treatment",
		features: [
			"Stroke management",
			"Epilepsy treatment",
			"Headache clinic",
			"Movement disorders",
		],
	},
	{
		id: 3,
		title: "Primary Care Consultations",
		category: "primary",
		description: "Comprehensive healthcare services for patients of all ages.",
		icon: Stethoscope,
		image: "/placeholder.svg?height=400&width=600&text=Primary+Care",
		features: [
			"Preventive care",
			"Chronic disease management",
			"Immunizations",
			"Health screenings",
		],
	},
	{
		id: 4,
		title: "Medication Management",
		category: "pharmacy",
		description:
			"Expert guidance on medication use, interactions, and management.",
		icon: Pill,
		image: "/placeholder.svg?height=400&width=600&text=Medication+Management",
		features: [
			"Prescription services",
			"Medication review",
			"Compounding services",
			"Medication synchronization",
		],
	},
	{
		id: 5,
		title: "Orthopedic Surgery",
		category: "orthopedics",
		description:
			"Surgical and non-surgical treatments for musculoskeletal issues.",
		icon: Bone,
		image: "/placeholder.svg?height=400&width=600&text=Orthopedic+Surgery",
		features: [
			"Joint replacement",
			"Sports medicine",
			"Fracture care",
			"Spine surgery",
		],
		popular: true,
	},
	{
		id: 6,
		title: "Vision Correction",
		category: "ophthalmology",
		description:
			"Advanced procedures to improve vision and treat eye conditions.",
		icon: Eye,
		image: "/placeholder.svg?height=400&width=600&text=Vision+Correction",
		features: [
			"LASIK surgery",
			"Cataract removal",
			"Glaucoma treatment",
			"Retinal care",
		],
	},
	{
		id: 7,
		title: "Dental Implants",
		category: "dental",
		description:
			"Permanent solution for missing teeth with natural-looking results.",
		icon: Tooth,
		image: "/placeholder.svg?height=400&width=600&text=Dental+Implants",
		features: [
			"Single tooth replacement",
			"Full arch restoration",
			"Bone grafting",
			"3D imaging",
		],
	},
	{
		id: 8,
		title: "Pediatric Wellness",
		category: "pediatrics",
		description:
			"Comprehensive healthcare services specifically for children and adolescents.",
		icon: Baby,
		image: "/placeholder.svg?height=400&width=600&text=Pediatric+Wellness",
		features: [
			"Well-child visits",
			"Developmental screening",
			"Immunizations",
			"Behavioral health",
		],
	},
	{
		id: 9,
		title: "Diagnostic Testing",
		category: "laboratory",
		description:
			"Advanced laboratory services for accurate diagnosis and treatment planning.",
		icon: Microscope,
		image: "/placeholder.svg?height=400&width=600&text=Diagnostic+Testing",
		features: ["Blood work", "Genetic testing", "Pathology", "Microbiology"],
	},
	{
		id: 10,
		title: "Cardiac Imaging",
		category: "cardiology",
		description:
			"Non-invasive imaging techniques to evaluate heart structure and function.",
		icon: Activity,
		image: "/placeholder.svg?height=400&width=600&text=Cardiac+Imaging",
		features: [
			"Echocardiography",
			"Cardiac CT",
			"Cardiac MRI",
			"Nuclear cardiology",
		],
	},
];
