import nodeMediaServer from "node-media-server";
import { logger } from "../utils/logger";
import config from "../config";
import { User, UserStates } from "../api/componets/user/store";
import { GenerateStreamThumbnail } from "../utils/generateStreamThumbnail";

export function InitRTMP() {
	const mediaServer = new nodeMediaServer(<any>config.rtmp);

	mediaServer.on("prePublish", async (id, StreamPath, args) => {
		let stream_key = getStreamKeyFromStreamPath(StreamPath);
		let session: any = mediaServer.getSession(id);

		console.log(
			"[prePublish]",
			`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
		);

		if (stream_key !== "") {
			const user = await User.findOne({
				where: { username: stream_key },
			});
			if (user) {
				user.set("status", UserStates.ONLINE);
				user.save();
				logger.log(`${user.get("username")} initiated a live`);
				GenerateStreamThumbnail(stream_key);
			} else {
				session.reject();
			}
		} else {
			session.reject();
		}
	});

	mediaServer.run();
	mediaServer.on("preConnect", (id, args) => {
		console.log(
			"[NodeEvent on preConnect]",
			`id=${id} args=${JSON.stringify(args)}`
		);
		// let session = nms.getSession(id);
		// session.reject();
	});

	mediaServer.on("postConnect", (id, args) => {
		console.log(
			"[NodeEvent on postConnect]",
			`id=${id} args=${JSON.stringify(args)}`
		);
	});

	mediaServer.on("doneConnect", (id, args) => {
		console.log(
			"[NodeEvent on doneConnect]",
			`id=${id} args=${JSON.stringify(args)}`
		);
	});

	mediaServer.on("postPublish", (id, StreamPath, args) => {
		console.log(
			"[NodeEvent on postPublish]",
			`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
		);
	});

	mediaServer.on("donePublish", async (id, StreamPath, args) => {
		let stream_key = getStreamKeyFromStreamPath(StreamPath);
		const user = await User.findOne({
			where: { username: stream_key },
		});
		if (user) {
			user.set("status", UserStates.OFFLINE);
			user.save();
			logger.log(`${user.get("username")} finalized live`);
			GenerateStreamThumbnail(stream_key);
		}
		console.log(
			"[NodeEvent on donePublish]",
			`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
		);
	});

	mediaServer.on("prePlay", (id, StreamPath, args) => {
		console.log(
			"[NodeEvent on prePlay]",
			`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
		);
		// let session = nms.getSession(id);
		// session.reject();
	});

	mediaServer.on("postPlay", (id, StreamPath, args) => {
		console.log(
			"[NodeEvent on postPlay]",
			`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
		);
	});

	mediaServer.on("donePlay", (id, StreamPath, args) => {
		console.log(
			"[NodeEvent on donePlay]",
			`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
		);
	});
	logger.log(`RTMP server listen on port ${1935}`);
	logger.log(`HTTP & WS server of media server listen on port ${8888}`);
}

const getStreamKeyFromStreamPath = (path: string) => {
	let parts = path.split("/");
	return parts[parts.length - 1];
};
