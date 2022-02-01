const response = {
	success: (req: any, res: any, message: any, status: number) => {
		const statusCode = status || 200;
		const statusMessage = message || "";

		res.status(status).send({
			error: false,
			status,
			body: message,
		});
	},
	error: (req: any, res: any, message: any, status: number) => {
		const statusCode = status || 500;
		const statusMessage = message || "Internal server error";

		res.status(statusCode).send({
			error: false,
			status,
			body: message,
		});
	},
};

export default response;
