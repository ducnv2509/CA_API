import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";
import { BAD_REQUEST } from "../constant/HttpResponseCode.js";

export async function updateTicketByStaff(account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, request_type_id, sizing_id, id) {
    let params = [account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, request_type_id, sizing_id, id]
    let sql = `CALL updateTicketByStaff(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return { statusCode: 200, data: { account_name, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, request_type_id, sizing_id, status_id } };
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
        let id = ret.res;
        if (id > 0) {
            return { statusCode: 200, data: { ticket_id, created_by_account, new_status, note, date_activity, time_spent } };
        } else {
            return { statusCode: BAD_REQUEST, error: 'UPDATE_FALSE', description: 'update false' };
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}


export async function updateTransferTicketByStaff(ticket_id, new_group, new_assignee, time_spent, note, date_of_activity, create_by_account) {
    let params = [ticket_id, new_group, new_assignee, time_spent, note, date_of_activity, create_by_account]
    let sql = `CALL transferTicketByStaff(?, ?, ?, ?,?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        let id = ret.res;
        if (id > 0) {
            return { statusCode: 200, data: { ticket_id, created_by_account, new_status, note, date_activity, time_spent } };
        } else {
            return { statusCode: BAD_REQUEST, error: 'UPDATE_FALSE', description: 'update false' };
        }
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
        if (id > 0) {
            return { statusCode: 200, data: { ticket_id, created_by_account, new_status, note, date_activity, time_spent } };
        } else {
            return { statusCode: BAD_REQUEST, error: 'UPDATE_FALSE', description: 'update false' };
        }
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
        let statusArr = [];
        let requestArr = [];
        for (const r of ret) {
            let { id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id, request_type_id, request_type_name } = r;
            let statusNum = !statusArr[status_name] ? 1 : statusArr[status_name] + 1;
            statusArr[status_name] = statusNum;
            let requestNum = !requestArr[request_type_name] ? 1 : requestArr[request_type_name] + 1;
            requestArr[request_type_name] = requestNum;

            if (objMap[status_id]) {
                objMap[status_id].details.push({
                    id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                    description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id, request_type_id, request_type_name
                });
            } else {
                let details = [{
                    id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                    description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id, request_type_id, request_type_name
                }];
                objMap[status_id] = { type: status_name, details };
            }
        }

        Object.keys(objMap).forEach(o => {
            // myLogger.info(objMap[o])
            arr.push(objMap[o]);
        });
        let status = [];
        Object.keys(statusArr).forEach(o => {
            // myLogger.info(objMap[o])
            status.push({ statusName: o, quantity: statusArr[o] });
        });
        let requests = [];
        Object.keys(requestArr).forEach(o => {
            myLogger.info(requestArr[o])
            requests.push({ requestName: o, quantity: requestArr[o] });
        });
        // console.log(ret);
        return { statusCode: 200, data: { tickets: arr, status, requests } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}



export async function createTicketByStaff(account_name,
    customer_name,
    category_id,
    project_id,
    summary,
    group_id,
    priority_id,
    scope,
    assignee_id,
    description_by_staff,
    request_type_id,
    sizing_id,
    resolved_date) {
    let params = [account_name,
        customer_name,
        category_id,
        project_id,
        summary,
        group_id,
        priority_id,
        scope,
        assignee_id,
        description_by_staff,
        request_type_id,
        sizing_id,
        resolved_date]
    let sql = `CALL createTicketByStaff(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        console.log(ret);
        let id = ret.res;
        return {
            statusCode: 200, data: {
                id, account_name,
                customer_name,
                category_id,
                project_id,
                summary,
                group_id,
                priority_id,
                scope,
                assignee_id,
                description_by_staff,
                request_type_id,
                sizing_id,
                resolved_date
            }
        };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}

export async function getDetailsTicket(ticket_id, account_name) {
    let params = [ticket_id]
    let paramsLog = [account_name, ticket_id]
    let sql = `CALL getAllTicketById(?)`
    let sqlLog = `CALL getLogCommentByTicket(?,?)`
    try {
        const result = await query(sql, params);
        const resultLog = await query(sqlLog, paramsLog);
        let ret = result[0];
        let retLog = resultLog[0];

        let details = [];
        let detailsLog = [];
        ret.forEach(e => {
            let { id, ticket_id, date_create, create_by_account, new_status, note, date_activity, time_spent, activity_type, assignee_id, new_group, status_name } = e;
            details.push({ id, ticket_id, date_create, create_by_account, new_status, note, date_activity, time_spent, activity_type, assignee_id, new_group, status_name });
        })
        retLog.forEach(e => {
            let { id, ticket_id, date_create, create_by_account, note, date_activity, time_spent, activity_type } = e;
            detailsLog.push({ id, ticket_id, date_create, create_by_account, note, date_activity, time_spent, activity_type });
        })
        return { statusCode: 200, data: { details, detailsLog } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}

export async function getTimeSpent(account_name) {
    let params = [account_name]
    let sql = `CALL getTimeSpent(?)`
    try {
        const result = await query(sql, params);
        let ret = result[0];
        let details = [];
        ret.forEach(e => {
            let { count0, count1, count2, count3, count4, count5, count6, count7 } = e;
            details.push({ count0, count1, count2, count3, count4, count5, count6, count7 });
        })
        return { statusCode: 200, data: { details } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}
