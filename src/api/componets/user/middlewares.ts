import {
	validateParams,
	lengthBounds,
	validatePhones,
	validateEmail,
	IParam,
	validateNickname,
} from "../../../utils/validator";

const CREATE_USER: IParam[] = [
	{
		param_key: "email",
		type: "string",
		required: true,
		validator_functions: [validateEmail],
	},
	{
		param_key: "fullname",
		type: "string",
		required: true,
		validator_functions: [],
	},
	{
		param_key: "username",
		type: "string",
		required: true,
		validator_functions: [validateNickname],
	},
	{
		param_key: "about",
		type: "string",
		required: false,
	},
	{
		param_key: "title",
		type: "string",
		required: false,
	},
	{
		param_key: "password",
		type: "string",
		required: true,
	},
];

const UPDATE_USER: IParam[] = [
	{
		param_key: "email",
		type: "string",
		required: false,
		validator_functions: [validateEmail],
	},
	{
		param_key: "fullname",
		type: "string",
		required: false,
		validator_functions: [],
	},
	{
		param_key: "username",
		type: "string",
		exclude: true,
	},
	{
		param_key: "about",
		type: "string",
		required: false,
	},
	{
		param_key: "title",
		type: "string",
		required: false,
	},
	{
		param_key: "password",
		type: "string",
		required: false,
	},
	{
		param_key: "status",
		type: "string",
		exclude: true,
	},
	{
		param_key: "photo",
		type: "string",
		exclude: true,
	},
	{
		param_key: "id",
		type: "string",
		exclude: true,
	},
];

export const createUserValidator = validateParams(CREATE_USER);
export const updateUserValidator = validateParams(UPDATE_USER);
