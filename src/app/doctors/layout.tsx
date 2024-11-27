export const metadata = {
	title: "MediCare",
	description: "Welcome to MediCare",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
