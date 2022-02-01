import jsonwebtoken from "jsonwebtoken";

class JWT {
	secret: string;
	constructor(secret: string) {
		this.secret = secret;
	}

	sign(payload: object, config?: jsonwebtoken.SignOptions) {
		return jsonwebtoken.sign(payload, this.secret, config);
	}

	verify(token: string) {
		return jsonwebtoken.verify(token, this.secret);
	}
}

export default JWT;
