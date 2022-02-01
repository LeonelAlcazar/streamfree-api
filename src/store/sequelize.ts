import { Sequelize, Model, DataTypes } from "sequelize";
import { logger } from "../utils/logger";
import cliSpinners from "cli-spinners";

export class Database {
	public sequelize: Sequelize | null = null;
	private static instance: Database;
	private constructor() {}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	public async Init(
		database: string,
		username: string,
		password: string,
		options: any
	) {
		this.sequelize = new Sequelize(database, username, password, options);
		logger.log("Trying to connect to the database");

		try {
			await this.sequelize.authenticate();
			logger.log("Database connection successful");
		} catch (error) {
			logger.error("Failed database connection");
			logger.error(error);
			await this.Init(database, username, password, options);
		}
	}
}
