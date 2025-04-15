import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

// Define the response type
type SymptomAnalysisResult = {
	urgency: "low" | "medium" | "high";
	recommendation: string;
	possibleConditions: string[];
	confidence: number;
};

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const { symptoms } = await request.json();

		if (!symptoms || typeof symptoms !== "string") {
			return NextResponse.json(
				{ error: "Symptoms are required" },
				{ status: 400 }
			);
		}

		try {
			// Call Hugging Face Inference API
			const response = await fetch(
				"https://api-inference.huggingface.co/models/facebook/bart-large",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY || "hf_app_free_tier_token"}`,
					},
					body: JSON.stringify({
						inputs: `Analyze the following medical symptoms and determine urgency (high, medium, or low), 
                    provide a recommendation, and list possible conditions: ${symptoms}`,
						parameters: {
							max_length: 500,
							temperature: 0.7,
						},
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`Hugging Face API error: ${response.status}`);
			}

			const data = await response.json();

			// Process the response to extract useful information
			// This is a simplified approach - you might need more sophisticated parsing
			const aiResponse = data[0]?.generated_text || "";

			// Parse the AI response to extract urgency, recommendations, and conditions
			// This is a simplified example - you'd want more robust parsing in production
			const result = processHuggingFaceResponse(aiResponse, symptoms);

			return NextResponse.json(result);
		} catch (error) {
			console.error("AI API error:", error);
			// Fall back to the rule-based system if the AI API fails
			const fallbackResult = analyzeSymptomsBasic(symptoms);
			return NextResponse.json(fallbackResult);
		}
	} catch (error: any) {
		console.error("Error analyzing symptoms:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to analyze symptoms" },
			{ status: 500 }
		);
	}
}

// Process the Hugging Face response to extract structured data
function processHuggingFaceResponse(
	aiResponse: string,
	originalSymptoms: string
): SymptomAnalysisResult {
	// This is a simplified processing function
	// In a real application, you would use more sophisticated NLP techniques

	// Default to the basic analyzer if we can't parse the AI response
	if (!aiResponse || aiResponse.length < 20) {
		return analyzeSymptomsBasic(originalSymptoms);
	}

	let urgency: "low" | "medium" | "high" = "low";
	let recommendation = "";
	let possibleConditions: string[] = [];
	let confidence = 70; // Default confidence

	// Simple keyword-based parsing
	const aiResponseLower = aiResponse.toLowerCase();

	// Determine urgency based on keywords
	if (
		aiResponseLower.includes("urgent") ||
		aiResponseLower.includes("emergency") ||
		aiResponseLower.includes("high urgency") ||
		aiResponseLower.includes("immediate")
	) {
		urgency = "high";
		confidence = 85;
	} else if (
		aiResponseLower.includes("moderate") ||
		aiResponseLower.includes("medium urgency") ||
		aiResponseLower.includes("consult")
	) {
		urgency = "medium";
		confidence = 75;
	}

	// Extract recommendation
	// Look for common recommendation patterns
	const recommendationPatterns = [
		/recommendation:([^.]*)/i,
		/recommend([^.]*)/i,
		/should([^.]*)/i,
	];

	for (const pattern of recommendationPatterns) {
		const match = aiResponseLower.match(pattern);
		if (match && match[1]) {
			recommendation = match[1].trim();
			break;
		}
	}

	// If we couldn't extract a recommendation, create a default one
	if (!recommendation) {
		if (urgency === "high") {
			recommendation =
				"Based on the analysis, it is recommended to seek medical attention promptly.";
		} else if (urgency === "medium") {
			recommendation =
				"Consider consulting with a healthcare provider about these symptoms.";
		} else {
			recommendation =
				"Monitor symptoms and rest. If they persist, consider scheduling an appointment.";
		}
	}

	// Extract possible conditions
	// Look for lists of conditions or diagnoses
	const conditionPatterns = [
		/conditions:([^.]*)/i,
		/possible diagnoses:([^.]*)/i,
		/may include:([^.]*)/i,
		/could be:([^.]*)/i,
	];

	for (const pattern of conditionPatterns) {
		const match = aiResponseLower.match(pattern);
		if (match && match[1]) {
			const conditionsText = match[1].trim();
			possibleConditions = conditionsText
				.split(/,|;|\n/)
				.map((c) => c.trim())
				.filter((c) => c.length > 0)
				.slice(0, 4); // Limit to 4 conditions
			break;
		}
	}

	// If we couldn't extract conditions, fall back to basic analyzer
	if (possibleConditions.length === 0) {
		const basicResult = analyzeSymptomsBasic(originalSymptoms);
		possibleConditions = basicResult.possibleConditions;
	}

	return {
		urgency,
		recommendation,
		possibleConditions,
		confidence,
	};
}

// Basic symptom analysis function (same as before)
function analyzeSymptomsBasic(symptoms: string): SymptomAnalysisResult {
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
		"seizure",
		"paralysis",
	];

	const mediumUrgencyKeywords = [
		"fever",
		"persistent",
		"worsening",
		"pain",
		"vomiting",
		"diarrhea",
		"infection",
		"migraine",
		"dizziness",
		"fainting",
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
