import { createPool } from "mysql";
import { HOST, USER, PASSWORD, DB_NAME, POOL, PORTDB } from "../config/config.js";
import myLogger from "../winstonLog/winston.js";
let configDB = {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB_NAME,
    pool: POOL,
    port: PORTDB
};
myLogger.info("DB config: %o",configDB);
let connection = createPool(configDB);
export default connection;