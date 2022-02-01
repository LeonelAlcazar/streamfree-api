import { Sequelize, Model, DataTypes } from "sequelize";
import { logger } from "../../../utils/logger";
import { Database } from "../../../store/sequelize";

export enum UserStates {
	OFFLINE = "offline",
	ONLINE = "online",
}

export class User extends Model {}

let synced = false;
export function Init() {
	User.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			fullname: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			photo: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "default.png",
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: UserStates.OFFLINE,
			},
			about: {
				type: DataTypes.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "",
			},
		},
		{
			sequelize: <Sequelize>Database.getInstance().sequelize,
			modelName: "user",
		}
	);
}

export function Sync(force: boolean) {
	logger.log("Synchronizing user model");
	if (!synced) {
		User.sync({ force })
			.then((v) => logger.log("User model synchronized"))
			.catch((e) => logger.error("Database model error", e));
		synced = true;
	}
}
