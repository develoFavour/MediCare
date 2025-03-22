import type React from "react";
import { Ambulance, Stethoscope, Activity } from "lucide-react";

interface ServiceProps {
	icon: string;
	h3: string;
	p: string;
	last: string;
}

const Service: React.FC<ServiceProps> = ({ icon, h3, p, last }) => {
	const getIcon = () => {
		if (icon.includes("ambulance"))
			return <Ambulance className="h-12 w-12 text-[#116aef]" />;
		if (icon.includes("medical"))
			return <Activity className="h-12 w-12 text-[#116aef]" />;
		return <Stethoscope className="h-12 w-12 text-[#116aef]" />;
	};

	return (
		<div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-2">
			<div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
				{getIcon()}
			</div>
			<h3 className="text-xl font-bold text-[#032b53] mb-4 text-center">
				{h3}
			</h3>
			<p className="text-gray-600 text-center">{p}</p>
			<div className="mt-6 flex justify-center">
				<button className="text-[#116aef] font-medium hover:text-[#5d9eff] transition-colors duration-300 flex items-center">
					Learn More
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 ml-1"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Service;
