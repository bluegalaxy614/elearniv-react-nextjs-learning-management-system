import React from "react";
import Navbar from "../components/_App/Navbar";
import PageBanner from "../components/Common/PageBanner";
import AboutUs from "../components/AboutUs/AboutUs";
import FeedbackSliderWithFunFacts from "@/components/eLearningSchool/FeedbackSliderWithFunFacts";
import Features from "@/components/eLearningSchool/Features";
import CourseAdvisor from "../components/Common/CourseAdvisor";
import Partner from "@/components/eLearningSchool/Partner";
import SubscribeForm from "../components/Common/SubscribeForm";
import Footer from "../components/_App/Footer";

export default function AbourUsPage({ user }) {
	return (
		<>
			<Navbar user={user} />

			<PageBanner
				pageTitle="About Us"
				homePageUrl="/"
				homePageText="Home"
				activePageText="About Us"
			/>

			<AboutUs />

			<FeedbackSliderWithFunFacts />

			<Features />

			<CourseAdvisor />

			<Partner />

			<SubscribeForm />

			<Footer />
		</>
	);
}
