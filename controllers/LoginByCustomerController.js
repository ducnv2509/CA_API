import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";
import { genTokenCustomer, genRefreshTokenCustomer } from '../token/ValidateToken.js';

export async function loginByCustomer(username, password) {
    let params = [username, password]
    let sql = `CALL customerLogin(?, ?)`;
    try {

        const result = await query(sql, params);
        let ret = result[0][0];
        let { res, id, full_name, email} = ret;
        if (res == 1) {
            let accsessToken = genTokenCustomer(username, full_name, email);
            let refreshToken = genRefreshTokenCustomer(username, full_name, email);
            return { statusCode: 200, data: { id, full_name, email, accsessToken, refreshToken } }
        } else {
            return { statusCode: 401, error: 'USERNAME_NOT_FOUND', description: 'username not found' };
        }
    } catch (e) {
        myLogger.info("login e: %o", e);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };

    } finally {

    }
}