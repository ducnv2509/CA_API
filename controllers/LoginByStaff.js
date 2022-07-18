import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";
import { genTokenStaff, genRefreshTokenStaff } from '../token/ValidateToken.js';

export async function loginByStaff(username, password) {
    let params = [username, password]
    let sql = `CALL staffLogin(?, ?)`;
    try {

        const result = await query(sql, params);
        let ret = result[0][0];
        let { res, id, full_name, email, phone, role } = ret;
        if (res == 1) {
            let accsessToken = genTokenStaff(username, full_name, email, phone, role);
            let refreshToken = genRefreshTokenStaff(username, full_name, email, phone, role);
            return { statusCode: 200, data: { full_name, email, phone, accsessToken, refreshToken, role } }
        } else {
            return { statusCode: 401, error: 'USERNAME_NOT_FOUND', description: 'username not found' };
        }
    } catch (e) {
        myLogger.info("login e: %o", e);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };

    } finally {

    }
}