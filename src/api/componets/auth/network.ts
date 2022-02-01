import express from "express";
import response from "../../../network/response";
import { BasicAuth } from "../../../secure/basicAuth";
import * as controller from "./controller";

const router = express.Router();

router.get("/", BasicAuth, GetJWT);

function GetJWT(req: any, res: any, next: any) {
	controller
		.GetJWT(req.decoded)
		.then((jwt) => response.success(req, res, jwt, 200))
		.catch(next);
}

export default router;
