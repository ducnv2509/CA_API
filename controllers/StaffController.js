import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";

export async function updateTicketByStaff(account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, request_type_id, id) {
    let params = [account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, request_type_id, id]
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


export async function ticketStatusAllByStaff(staff_account_name) {
    let params = [staff_account_name]
    let sql = `CALL ticketAllByStaff(?)`
    try {
        const result = await query(sql, params);
        let ret = result[0];
        myLogger.info(ret)
        let arr = [];
        let objMap = Object.create(null);

        for (const r of ret) {
            let { id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id } = r;
            if (objMap[status_id]) {
                objMap[status_id].details.push({
                    id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                    description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id
                });
            } else {
                let details = [{
                    id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                    description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id
                }];
                objMap[status_id] = { type: status_name, details };
            }
        }

        Object.keys(objMap).forEach(o => {
            myLogger.info(objMap[o])
            arr.push(objMap[o]);
        })
        // console.log(ret);
        return { statusCode: 200, data: { tickets: arr } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}