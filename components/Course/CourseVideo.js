import baseUrl from "@/utils/baseUrl";
import { secondsToHms } from "@/utils/helper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FsLightbox from "fslightbox-react";

const CourseVideo = ({ current_user, course }) => {
	// console.log(courseSlug);
	const [videos, setVideos] = useState([]);
	const [preview, setPreview] = useState("");
	const [toggler, setToggler] = useState(false);
	const [alreadyBuy, setAlreadyBuy] = useState(false);

	useEffect(() => {
		const fetchVideos = async () => {
			const url = `${baseUrl}/api/learnings/videos/${course.slug}`;
			const response = await axios.get(url);
			setVideos(response.data.videos);
			setPreview(response.data.videos[0].video);
			// console.log(response.data.videos);
		};
		fetchVideos();
	}, [course]);

	useEffect(() => {
		if (current_user && course && course.id) {
			const payload = {
				params: { userId: current_user.id, courseId: course.id },
			};
			const url = `${baseUrl}/api/courses/course/exist`;
			axios.get(url, payload).then((result) => {
				setAlreadyBuy(result.data.enroll);
			});
		}
	}, []);

	return (
		<>
			<div className="courses-curriculum">
				<ul>
					{videos &&
						videos.map((v) => (
							<li key={v.id}>
								<div className="d-flex justify-content-between align-items-center">
									<span className="courses-name">
										{v.title}
									</span>
									<div className="courses-meta">
										<span className="duration">
											{secondsToHms(v.video_length)}
										</span>
										{v.is_preview ? (
											<span
												className="status"
												onClick={() => {
													setPreview(v.video);
													setToggler(!toggler);
												}}
											>
												preview
											</span>
										) : alreadyBuy ? (
											<span
												className="status"
												onClick={() => {
													setPreview(v.video);
													setToggler(!toggler);
												}}
											>
												preview
											</span>
										) : (
											<span
												className="status locked"
												title="Premium"
											>
												<i className="flaticon-password"></i>
											</span>
										)}
									</div>
								</div>
							</li>
						))}
				</ul>
			</div>

			{preview && <FsLightbox toggler={toggler} sources={[preview]} />}
		</>
	);
};

export default CourseVideo;
