import ApiError from "../../../utils/error";
import { User, UserStates } from "../user/store";

export async function FindOne(id: string, io: any) {
	try {
		const user = await User.findOne({ where: { username: id } });
		if (!user) {
			throw new ApiError("Stream doesnt exist", 404);
		}
		const jsonUser = user.toJSON();
		const clients = io.sockets.adapter.rooms.get(jsonUser.username);
		const clientsCount = clients ? clients.size : 0;
		const stream = {
			user: jsonUser,
			title: jsonUser.title,
			viewers: clientsCount,
		};
		return stream;
	} catch (e) {
		throw e;
	}
}

export async function ListStreams(io: any) {
	try {
		const users = await User.findAll({
			where: { status: UserStates.ONLINE },
		});

		const streams = users.map((user) => {
			const jsonUser = user.toJSON();
			const clients = io.sockets.adapter.rooms.get(jsonUser.username);
			const clientsCount = clients ? clients.size : 0;
			return {
				user: jsonUser,
				title: jsonUser.title,
				viewers: clientsCount,
			};
		});
		return streams;
	} catch (e) {
		throw e;
	}
}
