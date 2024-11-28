import React, { Suspense } from "react";
import VerifyEmailContent from "./VeriyEmailContent";

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={<div>Verifying...</div>}>
			<VerifyEmailContent />
		</Suspense>
	);
}
