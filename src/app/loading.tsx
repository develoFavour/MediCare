import React from "react";

const Loading = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50">
			<div className="relative">
				<div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
				<div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<svg width="16px" height="12px">
						<polyline
							id="back"
							points="1 6 4 6 6 11 10 1 12 6 15 6"
							fill="none"
							stroke="#e0e0e0"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						></polyline>
						<polyline
							id="front"
							points="1 6 4 6 6 11 10 1 12 6 15 6"
							fill="none"
							stroke="#3b82f6"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="animate-dash"
						></polyline>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default Loading;
