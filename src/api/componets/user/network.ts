import express from "express";
import * as controller from "./controller";
import { BearerAuth } from "../../../secure/bearerAuth";
import response from "../../../network/response";
import { UserUpload } from "../../../store/multer.config";
import * as middlewares from "./middlewares";

const router = express.Router();

router.get("/me", BearerAuth, GetMyUser);
router.get("/query", GetUserQuery);
router.get("/:id", GetUserById);
router.get("/", ListUserQuery);

router.post(
	"/",
	UserUpload.single("profilePicture"),
	middlewares.createUserValidator,
	CreateUser
);
router.put(
	"/",
	BearerAuth,
	UserUpload.single("profilePicture"),
	middlewares.updateUserValidator,
	UpdateUser
);

function GetMyUser(req: any, res: any, next: any) {
	controller
		.FindOne({ id: req.decoded.id })
		.then((user) => response.success(req, res, user, 200))
		.catch(next);
}

function GetUserById(req: any, res: any, next: any) {
	controller
		.FindOne({ id: req.params.id })
		.then((user) => response.success(req, res, user, 200))
		.catch(next);
}
function GetUserQuery(req: any, res: any, next: any) {
	controller
		.FindOne(req.query)
		.then((user) => response.success(req, res, user, 200))
		.catch(next);
}
function ListUserQuery(req: any, res: any, next: any) {
	controller
		.FindAll(req.query)
		.then((users) => response.success(req, res, users, 200))
		.catch(next);
}

function CreateUser(req: any, res: any, next: any) {
	controller
		.RegisterUser(req.body, req.file)
		.then((user) => response.success(req, res, user, 201))
		.catch(next);
}

function UpdateUser(req: any, res: any, next: any) {
	controller
		.UpdateUser(req.body, req.file, req.decoded)
		.then((user) => response.success(req, res, user, 200))
		.catch(next);
}

export default router;
