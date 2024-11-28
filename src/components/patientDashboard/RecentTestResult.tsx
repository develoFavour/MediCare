import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestResult {
	id: string;
	testName: string;
	date: string;
	status: "normal" | "abnormal" | "pending";
	downloadUrl: string;
}

export function RecentTestResults({ results }: { results: TestResult[] }) {
	return (
		<Card className="bg-white shadow-md">
			<CardHeader className="bg-[#116aef] text-white p-4">
				<CardTitle className="text-base sm:text-lg font-semibold flex items-center">
					<FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
					Recent Test Results
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				{results.map((result) => (
					<div
						key={result.id}
						className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 last:mb-0 p-3 bg-[#e9f2ff] rounded-lg"
					>
						<div className="mb-2 sm:mb-0">
							<h3 className="font-medium text-[#116aef] text-sm sm:text-base">
								{result.testName}
							</h3>
							<p className="text-xs sm:text-sm text-gray-600">{result.date}</p>
							<span
								className={`text-xs font-semibold ${
									result.status === "normal"
										? "text-green-500"
										: result.status === "abnormal"
										? "text-red-500"
										: "text-yellow-500"
								}`}
							>
								{result.status.toUpperCase()}
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="text-[#116aef] border-[#116aef] hover:bg-[#116aef] hover:text-white text-xs sm:text-sm"
						>
							<Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
							Download
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
