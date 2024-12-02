// import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

import User from "database/models/user";

import { confirmEmailAddress } from "email-templates/account-confirmation";
import { isMobilePhone } from "validator";
import { Op } from "sequelize";

export default async function handler(req, res) {
	switch (req.method) {
		case "POST":
			await userSignup(req, res);
			break;
		default:
			res.status(405).json({
				message: `Method ${req.method} not allowed`,
			});
	}
}

const userSignup = async (req, res) => {
	const confirmToken = uuidv4();
	let { first_name, last_name, email,phone, password } = req.body;
	
	try {
		if (!isLength(first_name, { min: 3 })) {
			return res.status(422).json({
				message: "The first name should be a minimum of three characters long",
			});
		}
		if (!isLength(last_name, { min: 3 })) {
			return res.status(422).json({
				message: "The last name should be a minimum of three characters long",
			});
		}

		if (!email && !phone) {
			return res.status(422).json({
				message: "You must provide either an email or a phone number",
			});
		}
		if (email && !isEmail(email)) {
			return res.status(422).json({
				message: "Email should be a valid email address",
			});
		}
		if (phone && !isMobilePhone(phone)) {
			return res.status(422).json({
				message: "Phone number should be a valid phone number",
			});
		}

		if (!isLength(password, { min: 6 })) {
			return res.status(422).json({
				message: "Password should be a minimum of six characters long",
			});
		}

		// Check if user with that email if already exists
		const user = await User.findOne({
			where: {
				[Op.or]: [
					{ email: email || { [Op.is]: null } },
					{ phone: phone || { [Op.is]: null } },
				],
			},
		});
		

		if (user) {
			let message = "User already exists with";
		
			if (email) message += ` email ${email}`;
			if (phone) message += `${email ? " and" : ""} phone number ${phone}`;
		
			return res.status(422).json({ message });
		}

		// Encrypt password with bcrypt
		// const passwordHash = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			first_name,
			last_name,
			email,
			phone,
			// password: passwordHash,
			password: password,
			reset_password_token: confirmToken,
			reset_password_send_at: Date.now(),
		});

		if (email) {
			confirmEmailAddress(newUser);
		}

		const elarniv_users_token = jwt.sign(
			{
				userId: newUser.id,
				first_name: newUser.first_name,
				last_name: newUser.last_name,
				email: newUser.email,
				phone: newUser.phone,
				role: newUser.role,
				profile_photo: newUser.profile_photo,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		res.status(200).json({
			message: "Registration Successful!",
			elarniv_users_token,
		});
	} catch (e) {
		res.status(400).json({
			error_code: "create_user",
			message: e.message,
		});
	}
};
