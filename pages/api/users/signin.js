// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";

import User from "database/models/user";
import { isMobilePhone } from "validator";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export default async function handler(req, res) {
	switch (req.method) {
		case "POST":
			await userSignin(req, res);
			break;
		default:
			res.status(405).json({
				message: `Method ${req.method} not allowed`,
			});
	}
}

const userSignin = async (req, res) => {
	const { email, password } = req.body;

	try {
		let user;

		if (isEmail(email)) {
			user = await User.findOne({ where: { email } });
		} else if (isMobilePhone(email)) {
			user = await User.findOne({ where: { phone: email } });
		} else {
			return res.status(422).json({
				message: "Email or Phone Number should be a valid type",
			});
		}

		if (!user) {
			return res
				.status(404)
				.json({ message: "User account does not exist" });
		}

		if (user.lock_until && user.lock_until > Date.now()) {
			return res.status(403).json({
				message: "Account is temporarily locked due to multiple failed login attempts. Try again later.",
			});
		}

		if (!user.email_confirmed) {
			return res.status(404).json({
				message:
					"Email is not confirmed yet, please confirm your email.",
			});
		}

		if (!user.status) {
			return res.status(404).json({
				message:
					"This account is temporarily disabled, please contact the support email",
			});
		}

		// const passwordsMatch = await bcrypt.compare(password, user.password);
		const passwordsMatch = password == user.password;
		if (passwordsMatch) {

			user.failed_login_attempts = 0;
			user.lock_until = null;
			await user.save();

			const elarniv_users_token = jwt.sign(
				{
					userId: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					phone: user.phone,
					role: user.role,
					profile_photo: user.profile_photo,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "7d" }
			);
			res.status(200).json({
				message: "Login Successful!",
				elarniv_users_token,
			});
		} else {

			user.failed_login_attempts = (user.failed_login_attempts || 0) + 1;

			if (user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS) {
				user.lock_until = Date.now() + LOCK_TIME;
			}
			await user.save();

			res.status(401).json({ message: "Password is not correct" });
		}
	} catch (e) {
		// console.error(error)
		res.status(400).json({
			error_code: "user_login",
			message: e.message,
		});
	}
};
