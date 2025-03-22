import type React from "react";
import { Clock, Stethoscope, Ambulance, Activity } from "lucide-react";

interface CardProps {
	title: string;
	contentTitle: string;
	contentList1: string;
	contentList2: string;
	contentList3: string;
	icon?: string;
}

const Card: React.FC<CardProps> = ({
	title,
	contentTitle,
	contentList1,
	contentList2,
	contentList3,
	icon,
}) => {
	const getIcon = () => {
		if (icon?.includes("ambulance"))
			return <Ambulance className="h-10 w-10 text-white" />;
		if (icon?.includes("medical"))
			return <Activity className="h-10 w-10 text-white" />;
		if (icon?.includes("clock"))
			return <Clock className="h-10 w-10 text-white" />;
		return <Stethoscope className="h-10 w-10 text-white" />;
	};

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-gray-100">
			<div className="bg-gradient-to-r from-[#116aef] to-[#5d9eff] p-6 flex items-center">
				<div className="bg-white/20 p-3 rounded-full mr-4">{getIcon()}</div>
				<h3 className="text-xl font-bold text-white">{title}</h3>
			</div>
			<div className="p-6">
				<h4 className="text-[#032b53] font-semibold mb-4">{contentTitle}</h4>
				<ul className="space-y-3">
					<li className="flex items-start">
						<div className="w-2 h-2 bg-[#116aef] rounded-full mt-2 mr-2 flex-shrink-0"></div>
						<span className="text-gray-700">{contentList1}</span>
					</li>
					<li className="flex items-start">
						<div className="w-2 h-2 bg-[#116aef] rounded-full mt-2 mr-2 flex-shrink-0"></div>
						<span className="text-gray-700">{contentList2}</span>
					</li>
					<li className="flex items-start">
						<div className="w-2 h-2 bg-[#116aef] rounded-full mt-2 mr-2 flex-shrink-0"></div>
						<span className="text-gray-700">{contentList3}</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Card;
