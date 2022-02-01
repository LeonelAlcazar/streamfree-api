import { Op } from "sequelize";
import { hash } from "../../../utils/crypt";
import ApiError from "../../../utils/error";
import { Auth } from "../auth/store";
import { User } from "./store";

export function FindAll(query: { [field: string]: any }) {
	return User.findAll({
		where: query,
	});
}

export function FindOne(query: { [field: string]: any }) {
	return User.findOne({
		where: query,
	});
}

export async function RegisterUser(data: any, file: any) {
	try {
		const userWithEmailOrUsername = await User.findAll({
			where: {
				[Op.or]: [{ email: data.email }, { username: data.username }],
			},
		});

		if (userWithEmailOrUsername.length > 0) {
			throw new ApiError("Email or username are already in use", 400);
		}

		const user = await User.create({
			email: data.email,
			username: data.username,
			fullname: data.fullname,
			title: data.title || "",
			about: data.about || "",
			photo:
				file !== undefined && file !== null
					? file.filename
					: "default.png",
		});

		const passwordHash = await hash(data.password);

		const auth = await Auth.create({
			user_id: user.get("id"),
			email: data.email,
			password: passwordHash,
		});

		return user;
	} catch (e) {
		throw e;
	}
}

export async function UpdateUser(data: any, file: any, decoded: any) {
	try {
		let authPayload: { [key: string]: string } = {};
		let conditions = [];
		if (data.email) {
			authPayload.email = data.email;
			conditions.push({ email: data.email });
		}
		if (data.username) {
			conditions.push({ username: data.username });
		}
		if (conditions.length > 0) {
			const userWithEmailOrUsername = await User.findAll({
				where: { [Op.or]: conditions },
			});

			if (userWithEmailOrUsername.length > 0) {
				throw new ApiError("Email or username already in use", 400);
			}
		}

		const userPayload: { [key: string]: string } = { ...data };
		if (file) {
			userPayload.photo = file.filename;
		}
		const [affectedUsersCount, [user]] = await User.update(userPayload, {
			where: { id: decoded.id },
		});
		if (data.email || data.password) {
			if (data.password) {
				const passwordHash = await hash(data.password);

				authPayload.password = passwordHash;
			}
			await Auth.update(authPayload, { where: { user_id: decoded.id } });
		}

		return user;
	} catch (e) {
		throw e;
	}
}
