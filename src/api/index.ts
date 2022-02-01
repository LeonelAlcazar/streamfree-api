import cors from "cors";
import express from "express";
import http from "http";
import errors from "../network/errors";
import { InitSockets } from "./socket";
import path from "path";

import config from "../config";
import { logger } from "../utils/logger";

import usersRouter from "./componets/user/network";
import authRouter from "./componets/auth/network";
import streamsRouter from "./componets/streams/network";

export function InitApi(port: number) {
	const app = express();
	const server = http.createServer(app);
	const io = InitSockets(server);

	app.use(cors());

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use((req: any, res, next) => {
		req.io = io;
		next();
	});

	// Routes here
	app.use("/user", usersRouter);
	app.use("/auth", authRouter);
	app.use("/stream", streamsRouter);

	app.use(errors);

	server.listen(port, () => {
		logger.log(`HTTP server listen on port ${port}`);
	});
}
