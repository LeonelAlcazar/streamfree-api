import express from "express";
import response from "../../../network/response";
import * as controller from "./controller";

const router = express.Router();

router.get("/", ListStreams);
router.get("/:id", GetStream);

function GetStream(req: any, res: any, next: any) {
	controller
		.FindOne(req.params.id, req.io)
		.then((stream) => response.success(req, res, stream, 200))
		.catch(next);
}
function ListStreams(req: any, res: any, next: any) {
	controller
		.ListStreams(req.io)
		.then((streams) => response.success(req, res, streams, 200))
		.catch(next);
}

export default router;
