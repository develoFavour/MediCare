import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Static components that don't need client-side interactivity
import Banner from "@/components/Banner/Banner";
import Services from "@/components/Services/Services";
import Details from "@/components/Details/Details";
import Emergency from "@/components/Emergency/Emergency";
import NewsLetter from "@/components/NewsLetter/NewsLetter";

// Dynamically imported components
const WhoWeAre = dynamic(() => import("@/components/WhoWeAre/WhoWeAre"), {
	loading: () => <LoadingSpinner />,
	ssr: false,
});

const SliderHero = dynamic(() => import("@/components/SlideHero/SliderHero"), {
	loading: () => <LoadingSpinner />,
	ssr: false,
});

const Improved = dynamic(
	() => import("@/components/ImprovedServices/Improved")
);
const Offers = dynamic(() => import("@/components/Offers/Offers"));
const RecentNews = dynamic(() => import("@/components/RecentNews/RecentNews"));
const Sponsors = dynamic(() => import("@/components/Sponsors/Sponsors"));
const AppointmentContainer = dynamic(
	() => import("@/components/BookAppointmentForm/AppointmenContainer")
);

function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center min-h-[200px]">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default function Home() {
	return (
		<main>
			<Banner />

			<Services />
			<Details />
			<WhoWeAre />

			<Suspense fallback={<LoadingSpinner />}>
				<Emergency />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<SliderHero />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<Improved />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<Offers />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<RecentNews />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<Sponsors />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<AppointmentContainer />
			</Suspense>

			<NewsLetter />
		</main>
	);
}
