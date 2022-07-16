import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";

export async function getListCustomer() {
    let sql = `CALL getCustomer()`;
    let ret = undefined;
    try {
        const result = await query(sql);
        let res = result[0];
        let customers = [];
        for (let r of res) {
            let { id, username } = r;
            customers.push({ id, username })
        }
        ret = { statusCode: 200, data: { customers } };
    } catch (e) {
        myLogger.info("login e: %o", e);
        ret = { statusCode: 500, error: 'ERROR', description: 'System busy!' };

    } finally {
    }
    return ret;
}

export async function insertTicketByCustomer(customer_name, project_id, email, phone, resolved_date, summary, description) {
    let params = [customer_name, project_id, email, phone, resolved_date, summary, description]
    let sql = `CALL insertTicketByCustomer(?, ?, ?, ?, ?, ?, ?)`;
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return { statusCode: 200, data: { id, customer_name, project_id, email, phone, resolved_date, summary, description } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}