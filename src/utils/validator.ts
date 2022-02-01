import response from "../network/response";

export interface IParam {
	param_key: string;
	required?: boolean;
	exclude?: boolean;
	type: string;
	validator_functions?: CallableFunction[];
}
export function lengthBounds(min: number, max: number) {
	return (param: string | []) => {
		return param.length >= min && param.length <= max;
	};
}

export function validateEmail(email: string) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
}

export function validatePhones(phone: string) {
	const re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
	return re.test(phone);
}

export function validateNickname(nickname: string) {
	const re = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
	return re.test(nickname);
}

export const validateParams = (requestParams: IParam[]) => {
	return (req: any, res: any, next: any) => {
		const body: any = req.body;
		for (const param of requestParams) {
			if (checkParamPreset(Object.keys(req.body), param)) {
				const reqParam = body[param.param_key];
				if (param.exclude) {
					delete req.body[param.param_key];
					continue;
				}
				if (!checkParamType(reqParam, param)) {
					return response.error(
						req,
						res,
						`${param.param_key} is of type ` +
							`${typeof reqParam} but should be ${param.type}`,
						400
					);
				} else {
					if (!runValidators(reqParam, param)) {
						return response.error(
							req,
							res,
							`Validation failed for ${param.param_key}`,
							400
						);
					}
				}
			} else if (param.required) {
				return response.error(
					req,
					res,
					`Missing Parameter ${param.param_key}`,
					400
				);
			}
		}
		next();
	};
};

const checkParamPreset = (reqParams: string[], paramObj: IParam) => {
	return reqParams.includes(paramObj.param_key);
};

const checkParamType = (reqParam: any, paramObj: IParam) => {
	const reqParamType = typeof reqParam;
	return reqParamType === paramObj.type;
};

const runValidators = (reqParam: any, paramObj: IParam) => {
	const functions = paramObj.validator_functions || [];
	for (const validator of functions) {
		if (!validator(reqParam)) {
			return false;
		}
	}
	return true;
};
