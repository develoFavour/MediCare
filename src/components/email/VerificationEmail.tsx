import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
	verificationLink: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
	verificationLink,
}) => (
	<Html>
		<Head>
			<title>Verify your email for MediCare</title>
			<style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .animate-pulse {
            animation: pulse 2s infinite;
          }
        `}</style>
		</Head>
		<Preview>
			Welcome to MediCare - Verify Your Email to Begin Your Health Journey
		</Preview>
		<Body style={main}>
			<Container style={container}>
				<Img
					src={`${process.env.NEXT_PUBLIC_APP_URL}/medicare-logo.png`}
					width="200"
					height="60"
					alt="MediCare"
					style={logo}
				/>
				<Section style={heroSection}>
					<Img
						src={`${process.env.NEXT_PUBLIC_APP_URL}/health-hero.png`}
						width="560"
						height="200"
						alt="Welcome to MediCare"
						style={heroImage}
					/>
					<Heading style={h1}>Your Health Journey Begins Here</Heading>
				</Section>
				<Section style={contentSection}>
					<Text style={text}>
						Thank you for choosing MediCare as your trusted health partner. We
						are excited to have you on board!
					</Text>
					<Text style={text}>
						To ensure the security of your account and to start accessing our
						premium health services, please verify your email address by
						clicking the button below:
					</Text>
					<Section style={buttonContainer}>
						<Button
							style={button}
							href={verificationLink}
							className="animate-pulse"
						>
							Activate Your MediCare Account
						</Button>
					</Section>
					<Text style={smallText}>
						This link will expire in 24 hours for security reasons.
					</Text>
				</Section>
				<Hr style={hr} />
				<Section style={featuresSection}>
					<Heading as="h2" style={h2}>
						Whats Next?
					</Heading>
					<table style={featureTable}>
						<tr>
							<td style={featureCell}>
								<Img
									src={`${process.env.NEXT_PUBLIC_APP_URL}/profile-icon.png`}
									width="50"
									height="50"
									alt="Complete Profile"
								/>
								<Text style={featureText}>Complete Your Profile</Text>
							</td>
							<td style={featureCell}>
								<Img
									src={`${process.env.NEXT_PUBLIC_APP_URL}/appointment-icon.png`}
									width="50"
									height="50"
									alt="Book Appointment"
								/>
								<Text style={featureText}>Book Your First Appointment</Text>
							</td>
						</tr>
						<tr>
							<td style={featureCell}>
								<Img
									src={`${process.env.NEXT_PUBLIC_APP_URL}/health-track-icon.png`}
									width="50"
									height="50"
									alt="Track Health"
								/>
								<Text style={featureText}>Start Tracking Your Health</Text>
							</td>
							<td style={featureCell}>
								<Img
									src={`${process.env.NEXT_PUBLIC_APP_URL}/community-icon.png`}
									width="50"
									height="50"
									alt="Join Community"
								/>
								<Text style={featureText}>Join Our Health Community</Text>
							</td>
						</tr>
					</table>
				</Section>
				<Hr style={hr} />
				<Section style={footerSection}>
					<Text style={footerText}>
						If you did not sign up for MediCare, please disregard this email.
						Your information remains secure.
					</Text>
					<Text style={footerText}>
						Need help? Contact our support team at{" "}
						<Link href="mailto:support@medicare.com" style={link}>
							support@medicare.com
						</Link>
					</Text>
				</Section>
			</Container>
		</Body>
	</Html>
);

const main = {
	backgroundColor: "#f0f4f8",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	width: "560px",
	backgroundColor: "#ffffff",
	borderRadius: "8px",
	overflow: "hidden",
	boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const logo = {
	margin: "0 auto 20px",
	display: "block",
};

const heroSection = {
	backgroundColor: "#e3f2fd",
	padding: "40px 0",
	textAlign: "center" as const,
};

const heroImage = {
	margin: "0 auto 20px",
	display: "block",
	maxWidth: "100%",
	borderRadius: "8px",
};

const h1 = {
	color: "#1565c0",
	fontSize: "28px",
	fontWeight: "700",
	lineHeight: "36px",
	letterSpacing: "-0.5px",
	margin: "0",
	padding: "0",
	textAlign: "center" as const,
};

const contentSection = {
	padding: "40px 30px",
};

const text = {
	color: "#37474f",
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
	margin: "0 0 24px",
};

const smallText = {
	...text,
	fontSize: "14px",
	color: "#78909c",
	textAlign: "center" as const,
	margin: "12px 0 0",
};

const buttonContainer = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const button = {
	backgroundColor: "#2e7d32",
	borderRadius: "4px",
	color: "#ffffff",
	fontSize: "16px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "12px 24px",
	fontWeight: "bold",
	textTransform: "uppercase" as const,
	letterSpacing: "0.5px",
};

const hr = {
	borderColor: "#e0e0e0",
	margin: "0",
};

const featuresSection = {
	padding: "40px 30px",
	backgroundColor: "#fafafa",
};

const h2 = {
	color: "#1565c0",
	fontSize: "24px",
	fontWeight: "700",
	lineHeight: "32px",
	margin: "0 0 24px",
	textAlign: "center" as const,
};

const featureTable = {
	width: "100%",
	borderCollapse: "separate" as const,
	borderSpacing: "10px",
};

const featureCell = {
	textAlign: "center" as const,
	padding: "16px",
	backgroundColor: "#ffffff",
	borderRadius: "8px",
	boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const featureText = {
	color: "#37474f",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "8px 0 0",
};

const footerSection = {
	padding: "40px 30px",
	backgroundColor: "#e8eaf6",
};

const footerText = {
	color: "#5c6bc0",
	fontSize: "14px",
	lineHeight: "20px",
	textAlign: "center" as const,
	margin: "0 0 12px",
};

const link = {
	color: "#3949ab",
	textDecoration: "underline",
};

export default VerificationEmail;
