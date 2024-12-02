import React from "react";
import Navbar from "@/components/_App/Navbar";
import MainBanner from "@/components/eLearningSchool/MainBanner";
import Partner from "@/components/eLearningSchool/Partner";
import Features from "@/components/eLearningSchool/Features";
import AboutUs from "@/components/eLearningSchool/AboutUs";
import PopularCourses from "@/components/eLearningSchool/PopularCourses";
import FeedbackSliderWithFunFacts from "@/components/eLearningSchool/FeedbackSliderWithFunFacts";
import GetInstantCourses from "@/components/eLearningSchool/GetInstantCourses";
import ViewAllCourses from "@/components/eLearningSchool/ViewAllCourses";
import SubscribeForm from "@/components/Common/SubscribeForm";
import Footer from "@/components/_App/Footer";
import baseUrl from "@/utils/baseUrl";

function Index({ courses, user }) {
	return (
		<>
			<Navbar user={user} />
			<MainBanner user={user} courses={courses} />
			<Features />
			<AboutUs />
			<PopularCourses user={user} />
			<FeedbackSliderWithFunFacts />
			<GetInstantCourses user={user} />
			<ViewAllCourses />
			<Partner />
			<SubscribeForm />
			<Footer />
		</>
	);
}

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API
	const res = await fetch(`${baseUrl}/api/home-banner`);
	const { courses } = await res.json();

	// Pass data to the page via props
	return { props: { courses } };
}

export default Index;
