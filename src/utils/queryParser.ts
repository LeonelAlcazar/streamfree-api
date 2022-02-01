const parserFunctions: any = {
	boolean: (str: string) => str === "true",
	number: (str: string) => Number(str),
};

function queryParser(schema: { [key: string]: string }) {
	return (req: any, res: any, next: any) => {
		const querys = req.query;
		for (const k of Object.keys(schema)) {
			if (querys[k] !== undefined && querys[k] !== "") {
				req.query[k] = parserFunctions[schema[k]](querys[k]);
			}
		}
		next();
	};
}

export default queryParser;
