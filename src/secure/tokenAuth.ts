import response from "../network/response";
import * as authController from "../api/componets/auth/controller";

export async function TokenAuth(token: string) {
	try {
		const user = await authController.GetUserByToken(token);
		return user.toJSON();
	} catch (e) {
		throw e;
	}
}
