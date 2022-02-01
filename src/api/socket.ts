import { Server } from "socket.io";
import http from "http";
import { TokenAuth } from "../secure/tokenAuth";
import { logger } from "../utils/logger";
export function InitSockets(httpServer: http.Server) {
	const io = new Server(httpServer, {
		cors: {
			origin: "*",
		},
	});

	io.on("connection", (socket) => {
		console.log("CONNECT");
		let streamID = "";
		socket.on("stream:suscribe", (data) => {
			if (streamID !== "") {
				socket.leave(streamID);
			}

			socket.join(data.streamID);
			streamID = data.streamID;
			socket.emit("stream:info", {
				viewers: io.sockets.adapter.rooms.get(streamID).size,
			});
			socket.to(streamID).emit("stream:connection", {});
		});
		socket.on("stream:unsuscribe", (data) => {
			if (streamID !== "") {
				socket.leave(streamID);
			}

			streamID = "";
			socket.to(streamID).emit("stream:disconnection", {});
		});

		socket.on("stream:message", (data) => {
			logger.log("new message", JSON.stringify(data));
			TokenAuth(data.token)
				.then((user) => {
					logger.log(user);
					io.to(streamID).emit("stream:message", {
						from: user,
						message: data.message,
					});
				})
				.catch((e) => {});
		});
		socket.on("disconnect", () => {
			if (streamID !== "") {
				socket.to(streamID).emit("stream:disconnection", {});
			}
		});
	});

	return io;
}
