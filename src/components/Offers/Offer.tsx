import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
	text: string;
	included: boolean;
}

interface ProcedureCardProps {
	title: string;
	Icon: string;
	price: number;
	features: Feature[];
}

const ProcedureCard: React.FC<ProcedureCardProps> = ({
	title,
	Icon,
	price,
	features,
}) => (
	<div className=" p-6 rounded-lg shadow-md flex flex-col offer offer-card">
		<div className="flex justify-center mb-4">
			<i className={Icon}></i>
		</div>
		<h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
		<div className=" text-center mb-2 flex items-center justify-center">
			<p className="amount">${price} </p>{" "}
			<span className="mt-4">/ Per Visit</span>
		</div>

		<ul className="space-y-2 mb-6 flex-grow">
			{features.map((feature, index) => (
				<li key={index} className="flex items-center">
					{feature.included ? (
						<Check className="w-5 h-5 text-blue-500 mr-2" />
					) : (
						<X className="w-5 h-5 text-gray-400 mr-2" />
					)}
					<span
						className={feature.included ? "text-gray-700" : "text-gray-400"}
					>
						{feature.text}
					</span>
				</li>
			))}
		</ul>
		<button className="btn">Book Now</button>
	</div>
);

export default function Offer() {
	const procedures: ProcedureCardProps[] = [
		{
			title: "Plastic Surgery",
			Icon: "icofont-ui-cut",
			price: 199,
			features: [
				{ text: "Lorem Ipsum Dolor Sit", included: true },
				{ text: "Cubitur Sollicitudin Fentum", included: true },
				{ text: "Nullam Interdum Enim", included: false },
				{ text: "Donec Ultricies Metus", included: false },
				{ text: "Pellentesque Eget Nibh", included: false },
			],
		},
		{
			title: "Teeth Whitening",
			Icon: "icofont-tooth",
			price: 299,
			features: [
				{ text: "Lorem Ipsum Dolor Sit", included: true },
				{ text: "Cubitur Sollicitudin Fentum", included: true },
				{ text: "Nullam Interdum Enim", included: true },
				{ text: "Donec Ultricies Metus", included: false },
				{ text: "Pellentesque Eget Nibh", included: false },
			],
		},
		{
			title: "Heart Surgery",
			Icon: "icofont-heart-beat",
			price: 399,
			features: [
				{ text: "Lorem Ipsum Dolor Sit", included: true },
				{ text: "Cubitur Sollicitudin Fentum", included: true },
				{ text: "Nullam Interdum Enim", included: true },
				{ text: "Donec Ultricies Metus", included: true },
				{ text: "Pellentesque Eget Nibh", included: true },
			],
		},
	];

	return (
		<div className="container mx-auto px-4 py-4 ">
			<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
				{procedures.map((procedure, index) => (
					<ProcedureCard key={index} {...procedure} />
				))}
			</div>
		</div>
	);
}
