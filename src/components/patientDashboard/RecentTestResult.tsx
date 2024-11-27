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
			<CardHeader className="bg-[#116aef] text-white">
				<CardTitle className="text-lg font-semibold flex items-center">
					<FileText className="w-5 h-5 mr-2" />
					Recent Test Results
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				{results.map((result) => (
					<div
						key={result.id}
						className="flex justify-between items-center mb-4 last:mb-0 p-3 bg-[#e9f2ff] rounded-lg"
					>
						<div>
							<h3 className="font-medium text-[#116aef]">{result.testName}</h3>
							<p className="text-sm text-gray-600">{result.date}</p>
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
							className="text-[#116aef] border-[#116aef] hover:bg-[#116aef] hover:text-white"
						>
							<Download className="w-4 h-4 mr-2" />
							Download
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
