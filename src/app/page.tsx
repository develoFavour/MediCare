import Banner from "@/components/Banner/Banner";
import AppointmentContainer from "@/components/BookAppointmentForm/AppointmenContainer";
import Details from "@/components/Details/Details";
import Emergency from "@/components/Emergency/Emergency";
import Improved from "@/components/ImprovedServices/Improved";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
import Offers from "@/components/Offers/Offers";
import RecentNews from "@/components/RecentNews/RecentNews";
import Services from "@/components/Services/Services";
import SliderHero from "@/components/SlideHero/SliderHero";
import Sponsors from "@/components/Sponsors/Sponsors";
import WhoWeAre from "@/components/WhoWeAre/WhoWeAre";
import Image from "next/image";

export default function Home() {
	return (
		<main className="">
			<Banner />
			<Services />
			<Details />
			<WhoWeAre />
			<Emergency />
			<SliderHero />
			<Improved />
			<Offers />
			<RecentNews />
			<Sponsors />
			<AppointmentContainer />
			<NewsLetter />
		</main>
	);
}
