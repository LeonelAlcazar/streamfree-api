import { Sequelize, Model, DataTypes } from "sequelize";
import { logger } from "../../../utils/logger";
import { Database } from "../../../store/sequelize";

export class Auth extends Model {}

let synced = false;
export function Init() {
	Auth.init(
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
			password: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize: <Sequelize>Database.getInstance().sequelize,
			modelName: "auth",
		}
	);
}

export function Sync(force: boolean) {
	logger.log("Synchronizing auth model");
	if (!synced) {
		Auth.sync({ force })
			.then((v) => logger.log("Auth model synchronized"))
			.catch((e) => logger.error("Database model error", e));
		synced = true;
	}
}
