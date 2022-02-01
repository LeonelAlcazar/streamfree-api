import response from "../network/response";
import * as authController from "../api/componets/auth/controller";

function existBearerToken(authorization: string) {
	return authorization.toUpperCase().indexOf("BEARER") >= 0;
}
export async function BearerAuth(req: any, res: any, next: any) {
	let authorization: string = req.headers.authorization || "";
	if (existBearerToken(authorization)) {
		authorization = authorization.slice(6, authorization.length).trim();
		try {
			const user = await authController.GetUserByToken(authorization);
			req.decoded = user.toJSON();
			next();
		} catch (e) {
			response.error(req, res, "UNAUTHORIZED", 401);
		}
	} else {
		response.error(req, res, "NO TOKEN", 401);
	}
}
