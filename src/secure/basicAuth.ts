import response from "../network/response";
import * as authController from "../api/componets/auth/controller";

export async function BasicAuth(req: any, res: any, next: any) {
	const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
	const [email, password] = Buffer.from(b64auth, "base64")
		.toString()
		.split(":");

	if (!email || !password) {
		response.error(req, res, "UNAUTHORIZED", 401);
	} else {
		try {
			const user = await authController.GetUserByLogin(email, password);
			req.decoded = user.toJSON();
			next();
		} catch (e) {
			response.error(req, res, "UNAUTHORIZED", 401);
		}
	}
}
