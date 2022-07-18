import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";

export async function updateTicketByStaff(account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, request_type_id, id) {
    let params = [account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id,request_type_id, id]
    let sql = `CALL updateTicketByStaff(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return { statusCode: 200, data: { account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, request_type_id, status_id } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }

}

export async function updateTicketStatusByStaff(ticket_id, created_by_account, new_status, note, date_activity, time_spent) {
    let params = [ticket_id, created_by_account, new_status, note, date_activity, time_spent]
    let sql = `CALL updateStatusTicketByStaff(?, ?, ?, ?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return { statusCode: 200, data: { ticket_id, created_by_account, new_status, note, date_activity, time_spent } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}


export async function updateTransferTicketByStaff(ticket_id, new_group, new_assignee, time_spent, date_of_activity, create_by_account) {
    let params = [ticket_id, new_group, new_assignee, time_spent, date_of_activity, create_by_account]
    let sql = `CALL transferTicketByStaff(?, ?, ?, ?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return { statusCode: 200, data: { ticket_id, new_group, new_assignee, time_spent, date_of_activity, create_by_account } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}

export async function updateCommentByStaff(ticket_id, created_by_account, note, date_activity, time_spent) {
    let params = [ticket_id, created_by_account, note, date_activity, time_spent]
    let sql = `CALL updateCommentByStaff(?, ?, ?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return { statusCode: 200, data: { ticket_id, created_by_account, note, date_activity, time_spent } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}