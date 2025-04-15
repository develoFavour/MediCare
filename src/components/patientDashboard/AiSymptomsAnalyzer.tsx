"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Brain, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";
import toast from "react-hot-toast";

export function AISymptomAnalyzer() {
	const { userData } = useUser();
	const [symptoms, setSymptoms] = useState("");
	const [analyzing, setAnalyzing] = useState(false);
	const [result, setResult] = useState<{
		urgency: "low" | "medium" | "high";
		recommendation: string;
		possibleConditions: string[];
		confidence: number;
	} | null>(null);
	const router = useRouter();

	const handleAnalyze = async () => {
		if (!symptoms.trim()) return;

		setAnalyzing(true);
		setResult(null);

		try {
			// In a real implementation, this would call your AI endpoint
			// const response = await axios.post("/api/ai/analyze-symptoms", {
			// 	symptoms,
			// });
			// console.log(response);

			const response = await fetch("/api/ai/analyze-symptoms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ symptoms }),
			});
			const data = await response.json();

			console.log(data);

			// Simulate API call with timeout
			// await new Promise((resolve) => setTimeout(resolve, 2500));

			// Mock response for demonstration
			// const mockResponse = analyzeSymptomsDemo(symptoms);
			setResult(data);
		} catch (error) {
			console.error("Error analyzing symptoms:", error);
		} finally {
			setAnalyzing(false);
		}
	};

	const handleBookAppointment = async () => {
		try {
			const response = await axios.post("/api/appointment-request", {
				userId: userData?._id,
				symptoms,
			});
			if (response.status === 200) {
				toast.success("Appointment request submitted successfully.");
				// router.push(`/patient/dashboard/upcoming-appointments`);
				console.log("Response :", response);
			} else {
				toast.error("Failed to submit appointment");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card className="shadow-md">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center text-lg font-semibold">
					<Brain className="mr-2 h-5 w-5 text-blue-600" />
					AI Symptom Analyzer
				</CardTitle>
				<CardDescription>
					Describe your symptoms in detail for an AI-powered preliminary
					analysis
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Textarea
					placeholder="Describe your symptoms in detail. For example: I've had a persistent headache for 3 days, along with mild fever and fatigue..."
					className="min-h-[120px] mb-4"
					value={symptoms}
					onChange={(e) => setSymptoms(e.target.value)}
				/>

				{analyzing && (
					<div className="space-y-2 my-4">
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm font-medium">Analyzing symptoms...</span>
							<span className="text-sm text-muted-foreground">Please wait</span>
						</div>
						<Progress value={45} className="h-2" />
					</div>
				)}

				{result && (
					<div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
						<div className="flex justify-between items-start">
							<div>
								<h4 className="font-medium mb-1">Urgency Level</h4>
								<Badge
									className={
										result.urgency === "high"
											? "bg-red-100 text-red-800 hover:bg-red-100"
											: result.urgency === "medium"
												? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
												: "bg-green-100 text-green-800 hover:bg-green-100"
									}
								>
									{result.urgency === "high"
										? "High - Seek medical attention soon"
										: result.urgency === "medium"
											? "Medium - Consult with a doctor"
											: "Low - Monitor symptoms"}
								</Badge>
							</div>
							<div className="text-right">
								<span className="text-sm text-gray-500">AI Confidence</span>
								<div className="flex items-center">
									<Progress
										value={result.confidence}
										className="h-2 w-20 mr-2"
									/>
									<span className="text-sm font-medium">
										{result.confidence}%
									</span>
								</div>
							</div>
						</div>

						<div>
							<h4 className="font-medium mb-1">Recommendation</h4>
							<p className="text-sm text-gray-700">{result.recommendation}</p>
						</div>

						<div>
							<h4 className="font-medium mb-1">Possible Conditions</h4>
							<div className="flex flex-wrap gap-2">
								{result.possibleConditions.map((condition, index) => (
									<Badge key={index} variant="outline" className="bg-white">
										{condition}
									</Badge>
								))}
							</div>
						</div>

						<div className="bg-blue-50 p-3 rounded-md flex items-start">
							<AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
							<p className="text-sm text-blue-700">
								This is an AI-powered preliminary analysis and not a medical
								diagnosis. Always consult with a healthcare professional for
								proper medical advice.
							</p>
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex justify-between pt-2">
				<Button
					variant="outline"
					onClick={() => {
						setSymptoms("");
						setResult(null);
					}}
					disabled={analyzing || !symptoms}
				>
					Clear
				</Button>
				<div className="space-x-2">
					<Button
						onClick={handleAnalyze}
						disabled={analyzing || !symptoms.trim()}
						variant="secondary"
					>
						{analyzing ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Analyzing...
							</>
						) : (
							<>
								<Brain className="mr-2 h-4 w-4" />
								Analyze Symptoms
							</>
						)}
					</Button>
					<Button onClick={handleBookAppointment} disabled={!symptoms.trim()}>
						Book Appointment
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}

// Demo function to simulate AI analysis based on keywords
function analyzeSymptomsDemo(symptoms: string): {
	urgency: "low" | "medium" | "high";
	recommendation: string;
	possibleConditions: string[];
	confidence: number;
} {
	const symptomsLower = symptoms.toLowerCase();

	// Check for high urgency keywords
	const highUrgencyKeywords = [
		"severe",
		"extreme",
		"unbearable",
		"chest pain",
		"difficulty breathing",
		"unconscious",
		"stroke",
		"heart attack",
	];
	const mediumUrgencyKeywords = [
		"fever",
		"persistent",
		"worsening",
		"pain",
		"vomiting",
		"diarrhea",
		"infection",
	];

	// Check if any high urgency keywords are present
	const hasHighUrgency = highUrgencyKeywords.some((keyword) =>
		symptomsLower.includes(keyword)
	);
	const hasMediumUrgency = mediumUrgencyKeywords.some((keyword) =>
		symptomsLower.includes(keyword)
	);

	let urgency: "low" | "medium" | "high" = "low";
	let recommendation = "";
	let possibleConditions: string[] = [];
	let confidence = 0;

	if (hasHighUrgency) {
		urgency = "high";
		recommendation =
			"Based on your symptoms, we recommend seeking medical attention promptly. Consider scheduling an urgent appointment or visiting an emergency room if symptoms are severe.";
		confidence = Math.floor(Math.random() * 15) + 75; // 75-90%

		// Determine possible conditions based on keywords
		if (
			symptomsLower.includes("chest pain") ||
			symptomsLower.includes("heart")
		) {
			possibleConditions.push("Cardiovascular Issue", "Angina");
		}
		if (
			symptomsLower.includes("breathing") ||
			symptomsLower.includes("breath")
		) {
			possibleConditions.push("Respiratory Distress", "Pulmonary Issue");
		}
		if (symptomsLower.includes("head") || symptomsLower.includes("migraine")) {
			possibleConditions.push("Severe Migraine", "Neurological Issue");
		}
	} else if (hasMediumUrgency) {
		urgency = "medium";
		recommendation =
			"We recommend consulting with a healthcare provider about your symptoms. Schedule an appointment with your doctor in the next few days.";
		confidence = Math.floor(Math.random() * 20) + 65; // 65-85%

		if (
			symptomsLower.includes("fever") ||
			symptomsLower.includes("temperature")
		) {
			possibleConditions.push("Viral Infection", "Bacterial Infection");
		}
		if (
			symptomsLower.includes("stomach") ||
			symptomsLower.includes("nausea") ||
			symptomsLower.includes("vomiting")
		) {
			possibleConditions.push("Gastroenteritis", "Food Poisoning");
		}
		if (
			symptomsLower.includes("cough") ||
			symptomsLower.includes("congestion")
		) {
			possibleConditions.push("Upper Respiratory Infection", "Bronchitis");
		}
		if (
			symptomsLower.includes("headache") ||
			symptomsLower.includes("head pain")
		) {
			possibleConditions.push("Tension Headache", "Migraine");
		}
	} else {
		urgency = "low";
		recommendation =
			"Your symptoms appear to be mild. Monitor your condition and rest. If symptoms persist or worsen, consider scheduling an appointment with your doctor.";
		confidence = Math.floor(Math.random() * 25) + 60; // 60-85%

		possibleConditions.push(
			"Common Cold",
			"Mild Fatigue",
			"Seasonal Allergies"
		);
	}

	// If no specific conditions were identified, add some generic ones
	if (possibleConditions.length === 0) {
		possibleConditions = ["General Discomfort", "Unspecified Condition"];
	}

	// Ensure we don't have more than 4 conditions
	if (possibleConditions.length > 4) {
		possibleConditions = possibleConditions.slice(0, 4);
	}

	return {
		urgency,
		recommendation,
		possibleConditions,
		confidence,
	};
}
