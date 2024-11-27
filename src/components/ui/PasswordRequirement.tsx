interface PasswordRequirement {
	label: string;
	isMet: boolean;
}

export function PasswordRequirements({ password }: { password: string }) {
	const requirements: PasswordRequirement[] = [
		{
			label: "At least 8 characters",
			isMet: password.length >= 8,
		},
		{
			label: "Contains uppercase letter",
			isMet: /[A-Z]/.test(password),
		},
		{
			label: "Contains lowercase letter",
			isMet: /[a-z]/.test(password),
		},
		{
			label: "Contains number",
			isMet: /\d/.test(password),
		},
		{
			label: "Contains special character",
			isMet: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		},
	];

	return (
		<div className="mt-2 space-y-1 grid grid-cols-2">
			{requirements.map((req, index) => (
				<div
					key={index}
					className={`text-xs flex items-center space-x-2 ${
						req.isMet ? "text-green-400" : "text-gray-400"
					}`}
				>
					<span>{req.isMet ? "✓" : "○"}</span>
					<span>{req.label}</span>
				</div>
			))}
		</div>
	);
}
