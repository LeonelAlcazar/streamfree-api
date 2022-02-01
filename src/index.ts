import { InitApi } from "./api";
import config from "./config";
import { InitRTMP } from "./rtmp/mediaServer";
import { Database } from "./store/sequelize";

import * as UserModel from "./api/componets/user/store";
import * as AuthModel from "./api/componets/auth/store";
import { logger } from "./utils/logger";

console.log(`  _________ __                                 _____                       
 /   _____//  |________   ____ _____    ______/ ____\\______   ____   ____  
 \\_____  \\\\   __\\_  __ \\_/ __ \\\\__  \\  /     \\   __\\\\_  __ \\_/ __ \\_/ __ \\ 
 /        \\|  |  |  | \\/\\  ___/ / __ \\|  Y Y  \\  |   |  | \\/\\  ___/\\  ___/ 
/_______  /|__|  |__|    \\___  >____  /__|_|  /__|   |__|    \\___  >\\___  >
        \\/                   \\/     \\/      \\/                   \\/     \\/ `);

Database.getInstance()
	.Init(config.mysql.ddbb, config.mysql.user, config.mysql.pass, {
		host: config.mysql.host,
		dialect: "mysql",

		logging: false,
	})
	.then(() => {
		logger.log("Synchronizing data models with database");
		UserModel.Init();
		AuthModel.Init();

		UserModel.User.hasOne(AuthModel.Auth, { foreignKey: "user_id" });

		UserModel.Sync(false);
		AuthModel.Sync(false);

		InitApi(config.api.port);
		InitRTMP();
	});
