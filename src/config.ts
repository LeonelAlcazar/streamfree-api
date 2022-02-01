import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default {
	secrets: {
		auth: process.env.AUTH_SECRET || "authsecret",
	},
	api: {
		port: parseInt(process.env.PORT) || 8080,
	},
	files: {
		public: path.join(__dirname, "../public"),
		userUpload: path.join(__dirname, "../media", "user_upload"),
	},
	mysql: {
		host: process.env.MYSQL_HOST || "localhost",
		user: process.env.MYSQL_USER || "root",
		pass: process.env.MYSQL_PASS || "root",
		ddbb: process.env.MYSQL_DDBB || "streamfree",
	},
	rtmp: {
		logType: 0,
		rtmp: {
			port: 1935,
			chunk_size: 60000,
			gop_cache: true,
			ping: 60,
			ping_timeout: 30,
		},
		http: {
			port: 8888,
			mediaroot: path.join(__dirname, "../media"),
			allow_origin: "*",
		},
		trans: {
			ffmpeg: "/usr/bin/ffmpeg",
			tasks: [
				{
					app: "live",
					hls: true,
					hlsFlags:
						"[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
					dash: true,
					dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
				},
			],
		},
	},
};
