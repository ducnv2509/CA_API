import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";

export async function updateTicketByStaff(account_name, category_id, group_id, priority_id, scope, assignee_id, id) {
    let params = [account_name, category_id, group_id, priority_id, scope, assignee_id, id]
    let sql = `CALL updateTicketByStaff(?, ?, ?, ?, ?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return { statusCode: 200, data: { account_name, category_id, group_id, priority_id, scope, assignee_id } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }

}