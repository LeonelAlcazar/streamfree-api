import childProcess from "child_process";
import config from "../config";
import path from "path";
import { logger } from "./logger";
const spawn = childProcess.spawn;
const cmd = config.rtmp.trans.ffmpeg;
export const GenerateStreamThumbnail = (stream_key: string) => {
	const p = path.join(
		config.rtmp.http.mediaroot,
		"thumbnails",
		stream_key + ".png"
	);
	logger.log("Generating thumbnail on", p);
	const args = [
		"-y",
		"-i",
		"http://127.0.0.1:8888/live/" + stream_key + "/index.m3u8",
		"-ss",
		"00:00:01",
		"-vframes",
		"1",
		"-vf",
		"scale=-2:300",
		p,
	];

	spawn(cmd, args, {
		detached: true,
		stdio: "ignore",
	}).unref();
};
