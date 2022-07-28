import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";
import { BAD_REQUEST, OK, SYSTEM_ERROR } from "../constant/HttpResponseCode.js";
import nodemailer from 'nodemailer';
import fetch from "node-fetch";

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
        myLogger.info("%o", ret)
        if (id > 0) {
            return { statusCode: OK, data: { ticket_id, new_group, new_assignee, time_spent, note, date_of_activity, create_by_account } };
        } else {
            return { statusCode: BAD_REQUEST, error: 'UPDATE_FALSE', description: 'update false' };
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}

export async function updateTransferTicketNew(
    ticket_id, new_group, assigneeName, time_spent, note, date_activity, created_by_account,
    issue_key, jsessionid) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let constUrl = `http://180.93.175.189:30001/api/issue/${issue_key}`
    try {
        const objLogin = {
            assigneeName
        }
        const body = JSON.stringify(objLogin);
        let headers = {
            "Content-Type": "application/json",
            jsessionid
        }
        let requestOptions = {
            method: 'PUT',
            body: body,
            headers,
        };
        let projectRes = await fetch(constUrl, requestOptions)
            .then(response => response.json());
        await sendMail(assigneeName + '@fpt.com.vn', note, issue_key, assigneeName)
        let params = [ticket_id, new_group, assigneeName, time_spent, note, date_activity, created_by_account]
        let sql = `CALL transferTicketByStaff(?, ?, ?, ?, ?, ?, ?)`
        try {
            const result = await query(sql, params);
            let ret = result[0][0];
            let id = ret.res;
            myLogger.info("%o", ret)
            if (id > 0) {
                ret = { statusCode: OK, data: { ticket_id, new_group, assigneeName, time_spent, note, date_activity, created_by_account } };
            } else {
                ret = { statusCode: BAD_REQUEST, error: 'UPDATE_FALSE', description: 'update false' };
            }
        } catch (error) {
            myLogger.info("login e: %o", error);
            ret = { statusCode: 500, error: 'ERROR', description: 'System busy!' };
        }
        ret = { statusCode: OK, data: { projectRes, ticket_id, new_group, assigneeName, time_spent, note, date_activity, created_by_account } }
    } catch (e) {
        myLogger.info("login e: %o", e);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'System busy!' };
    }
    return ret;
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
            return { statusCode: 200, data: { ticket_id, created_by_account, note, date_activity, time_spent } };
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
                description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id, request_type_id, request_type_name, issue_id, issue_key } = r;
            let statusNum = !statusArr[status_name] ? 1 : statusArr[status_name] + 1;
            statusArr[status_name] = statusNum;
            let requestNum = !requestArr[request_type_name] ? 1 : requestArr[request_type_name] + 1;
            requestArr[request_type_name] = requestNum;

            if (objMap[status_id]) {
                objMap[status_id].details.push({
                    id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                    description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id, request_type_id, request_type_name, issue_id, issue_key
                });
            } else {
                let details = [{
                    id, customer_name, project_id, category_id, email, phone, date_create, resolved_date, summary,
                    description_by_customer, group_id, priority_id, scope, assignee_id, description_by_staff, status_name, status_id, request_type_id, request_type_name, issue_id, issue_key
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


function makeCookie(jsessionid) {
    return `JSESSIONID=${jsessionid};`;
}
export async function createTicketByStaff(
    account_name,
    customer_name,
    project_id,
    summary,
    group_id,
    priority_id,
    scope,
    description_by_staff,
    request_type_id,
    sizing_id,
    resolved_date,
    component_name,
    time_spent,
    activity_date,
    assignee_name, jsessionid) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let constUrl = 'http://180.93.175.189:30001/api/issue-mine'
    try {
        const objLogin = {
            projectId: project_id,
            summary: summary,
            description: description_by_staff,
            componentName: component_name,
            timeSpent: time_spent,
            dueDate: resolved_date,
            startDate: activity_date,
            assigneeName: assignee_name
        }
        let headers = {
            "Content-Type": "application/json",
            jsessionid
        }
        const body = JSON.stringify(objLogin);
        let requestOptions = {
            method: 'POST',
            body: body,
            headers
        };
        let createTicket = await fetch(constUrl, requestOptions)
            .then(response => response.json());
        myLogger.info("asdashdhasd: %o", createTicket);
        let { createTaskRes } = createTicket;
        myLogger.info(createTicket);
        if (createTaskRes) {
            let { id, key } = createTaskRes;
            // let issue_id = createTaskRes.id;
            myLogger.info("IssueId %o", id);
            // myLogger.info("asdashdhasd: %o", createTicket);
            let params = [account_name,
                customer_name,
                project_id,
                summary,
                group_id,
                priority_id,
                scope,
                assignee_name,
                description_by_staff,
                request_type_id,
                sizing_id,
                resolved_date,
                id,
                component_name,
                time_spent,
                activity_date,
                key
            ]
            let sql = `CALL createTicketByStaff(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            try {
                const result = await query(sql, params);
                // let ret = result[0][0];
                console.log(ret);
                let idMaster = result[0][0].res;
                myLogger.info("idMaster: %o", idMaster);
                ret = {
                    statusCode: OK, data: {
                        idMaster, account_name,
                        customer_name,
                        project_id,
                        summary,
                        group_id,
                        priority_id,
                        scope,
                        description_by_staff,
                        request_type_id,
                        sizing_id,
                        resolved_date,
                        id,
                        component_name,
                        time_spent,
                        activity_date,
                        key
                    }
                };
            } catch (error) {
                myLogger.info("login e: %o", error);
                ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Create Issue error!' };
    }
    return ret;
}

export async function getDetailsTicket(ticket_id, account_name, jsessionid) {
    let params = [ticket_id]
    let sqlTicket = "CALL getTicketById(?)";
    let sql = `CALL getAllTicketById(?)`
    let sqlLog = `CALL getWorkLog(?)`
    let sqlComment = "Call getCommentByTicket(?)"
    try {
        const resultTicket = await query(sqlTicket, params);
        const result = await query(sql, params);
        const resultLog = await query(sqlLog, params);
        const resultComment = await query(sqlComment, params);
        let ret = result[0];
        let retLog = resultLog[0];
        let retTicket = resultTicket[0][0];
        let retComment = resultComment[0];
        let details = [];
        let detailsLog = [];
        let detailComment = [];

        let { id, customer_name, account_name, project_id, category_id, email, phone,
            date_create, resolved_date, summary, status_id, group_id, priority_id, scope,
            assignee_id, description_by_staff, request_type_id, sizing_id, assignee_name,
            issue_id, component_name, time_spent, activity_date, component_id, issue_key,
            name_priority, group_name, status_name, sizing_name, project_name, request_name
        } = resultTicket[0][0];
        ret.forEach(e => {
            let { id, ticket_id, date_create, create_by_account, new_status, note, date_activity, time_spent, activity_type, assignee_id, new_group, status_name,
            } = e;
            details.push({ id, ticket_id, date_create, create_by_account, new_status, note, date_activity, time_spent, activity_type, assignee_id, new_group, status_name });
        })
        retLog.forEach(e => {
            let { id, comment, time_spent, start_date, username, user_key, ot, phase_work_log, date_created, type_of_work, ticket_id, issue_id } = e;
            detailsLog.push({ id, comment, time_spent, start_date, username, user_key, ot, phase_work_log, date_created, type_of_work, ticket_id, issue_id });
        })
        retComment.forEach(e => {
            let { id, content, date_created, created_by_account, issue_ley, ticket_id } = e;
            detailComment.push({ id, content, date_created, created_by_account, issue_ley, ticket_id })
        })
        let transitionsResponse = await getUpdateStatus(issue_id, jsessionid);
        let { statusTransition } = transitionsResponse.data;
        return {
            statusCode: 200, data: {
                statusTransition,
                request_name,
                id, customer_name, account_name, project_id, category_id, email, phone,
                date_create, resolved_date, summary, status_id, group_id, priority_id, scope,
                assignee_id, description_by_staff, request_type_id, sizing_id, assignee_name,
                issue_id, component_name, time_spent, activity_date, component_id, issue_key,
                name_priority, group_name, status_name, sizing_name, project_name,
                details, detailsLog, detailComment
            }
        };
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
            let { count7, count6, count5, count4, count3, count2, count1, count0 } = e;
            details.push(count7);
            details.push(count6);
            details.push(count5);
            details.push(count4);
            details.push(count3);
            details.push(count2);
            details.push(count1);
            details.push(count0);
            // details.push({ count0, count1, count2, count3, count4, count5, count6, count7 });
        })
        return { statusCode: 200, data: { details } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}

export async function getAllProjects() {
    let sql = `CALL getAllProjects()`
    try {
        const result = await query(sql);
        let ret = result[0];
        let details = [];
        ret.forEach(e => {
            let { id, name, project_category, project_code, image } = e;
            details.push({ id, name, project_category, project_code, image });
        })
        return { statusCode: 200, data: { details } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}

export async function sendMail(email, content, issue_key, username) {
    let transporter = nodemailer.createTransport({
        host: 'mail.fpt.com.vn',
        port: 587,
        auth: {
            user: 'ducnv72@fpt.com.vn',
            pass: '!It0332429178_'
        }
    });

    let mailOptions = {
        from: `ducnv72@fpt.com.vn`,
        to: `${email}`,
        subject: 'Ticket Assigned',
        text: `Dear ${username},

        You have just been appended to ticket: ${issue_key} with content:
        
        =============================
        ${content}
        =============================
        
        Access to support.fis.vn or email to fis.support@fpt.com.vn for more information.
        
        Best & Regard.
        CA Team.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
        } else {
            return { statusCode: 200 };
        }
    });
}

export async function updateIssue(ticket_id, account_name, issue_id) {
    let params = [ticket_id, account_name, issue_id]
    let sql = `CALL updateIdIssue(?, ?,?)`
    try {
        const result = await query(sql, params);
        let ret = result[0][0];
        let id = ret.res;
        if (id > 0) {
            return { statusCode: OK, data: { ticket_id, account_name, issue_id } };
        } else {
            return { statusCode: BAD_REQUEST, error: 'UPDATE_FALSE', description: 'update false' };
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}


export async function findByIssue(issue_id, jsessionid) {
    const getUserUrl = `http://180.93.175.189:30001/api/issue/${issue_id}`;
    try {
        let headers = {
            "jsessionid": jsessionid
        }
        let requestOptions = {
            method: 'GET',
            headers
        };
        let user = await fetch(getUserUrl, requestOptions)
            .then(response => response.json());
        let { projectRes } = user;
        return { statusCode: 200, data: { projectRes } }
    } catch (e) {
        myLogger.info("login e: %o", e);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'System busy!' };
    }
    return ret;
}



export async function getTicketConfig() {
    let sqlProjects = `select *  from projects`;
    let sqlStatus = `select *  from status_support`;
    let sqlPriority = `select *  from priority`;
    let sqlRequest = `select *  from request_type`;
    let sqlGroup = "select * from `group`";
    let sqlSizing = `select *  from sizing`;
    try {
        const resultProjects = await query(sqlProjects);
        const resultStatus = await query(sqlStatus);
        const resultPriority = await query(sqlPriority);
        const resultRequest = await query(sqlRequest);
        const resultGroup = await query(sqlGroup);
        const resultSizing = await query(sqlSizing);
        let projects = [];
        let status = [];
        let priority = [];
        let request = [];
        let group = [];
        let sizing = [];

        resultProjects.forEach(e => {
            let { name,
                date_create,
                user_create,
                account_owner,
                department,
                project_code,
                project_id,
                project_category,
                image } = e;
            projects.push({
                name,
                date_create,
                user_create,
                account_owner,
                department,
                project_code,
                project_id,
                project_category,
                image
            });
        })
        resultStatus.forEach(e => {
            let { id, status_name } = e;
            status.push({
                id, status_name
            });
        })


        resultPriority.forEach(e => {
            let { id, name_priority } = e;
            priority.push({
                id, name_priority
            });
        })

        resultRequest.forEach(e => {
            let { id, request_type_name } = e;
            request.push({
                id, request_type_name
            });
        })
        resultGroup.forEach(e => {
            let { id,
                group_name } = e;
            group.push({
                id,
                group_name
            });
        })
        resultSizing.forEach(e => {
            let { id, name } = e;
            sizing.push({
                id, name
            });
        })
        return { statusCode: 200, data: { projects, status, priority, request, group, sizing } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}

export async function getNameComponentByProject(project_id) {
    let params = [project_id]
    let sql = `CALL getNameComponentByProjectCode(?)`
    try {
        const result = await query(sql, params);
        let component_name = result[0];
        return { statusCode: OK, data: { component_name } };
    } catch (error) {
        myLogger.info("login e: %o", error);
        return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
    }
}


export async function getUpdateStatus(
    issue_id, jsessionid) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let constUrl = `http://180.93.175.189:30001/api/issue/${issue_id}/transition/`
    try {
        let headers = {
            "jsessionid": jsessionid
        }
        let requestOptions = {
            method: 'GET',
            headers
        };
        let user = await fetch(constUrl, requestOptions)
            .then(response => response.json());
        let { projectRes } = user;
        let status = projectRes.transitions;
        let statusTransition = [];
        status.forEach(e => {
            let { id, name } = e;
            statusTransition.push({ id, name })
        })
        return { statusCode: 200, data: { statusTransition } }
    } catch (e) {
        myLogger.info("login e: %o", e);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'System busy!' };
    }
    return ret;
}

const mappingStatus = {
    "51": 7, "61": 7,
    "71": 2, "81": 2,
    "11": 3, "21": 8,
    "31": 9,
};

export async function updateTicketStatusByStaffNew(
    ticket_id, created_by_account, note, date_activity, time_spent,
    issue_key, status, jsessionid) {

    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let constUrl = `http://180.93.175.189:30001/api/issue/${issue_key}/transition/`
    try {
        const objLogin = {
            status
        }
        const body = JSON.stringify(objLogin);
        let headers = {
            "Content-Type": "application/json",
            jsessionid
        }
        let requestOptions = {
            method: 'PUT',
            body: body,
            headers,
        };
        let new_status = mappingStatus[status];
        if (new_status) {
            let params = [ticket_id, created_by_account, new_status, note, date_activity, time_spent]
            let sql = `CALL updateStatusTicketByStaff(?, ?, ?, ?, ?, ?)`
            try {
                const result = await query(sql, params);
                ret = result[0][0];
                let id = ret.res;
                if (id > 0) {
                    ret = { statusCode: 200, data: { ticket_id, created_by_account, new_status, note, date_activity, time_spent } };
                } else {
                    ret = { statusCode: BAD_REQUEST, error: 'UPDATE_FALSE', description: 'update false' };
                }
            } catch (error) {
                myLogger.info("login e: %o", error);
                return { statusCode: 500, error: 'ERROR', description: 'System busy!' };
            }
            let user = await fetch(constUrl, requestOptions)
                .then(response => response.json());
            let { projectRes } = user;
            return { statusCode: 200, data: { projectRes } }
        }
    } catch (e) {
        myLogger.info("login e: %o", e);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'System busy!' };
    }
    return ret;
}

const typeOfWorks = ['Create', 'Correct', 'Study', 'Review', 'Test'];
const phaseOfWorkLogs = [{ id: 46, name: 'Daily Activity' },
{ id: 53, name: 'Training' },
{ id: 54, name: 'Meeting' },
{ id: 55, name: 'Seminar' },
{ id: 56, name: 'Presales' },
{ id: 57, name: 'Research' },
{ id: 58, name: 'Others' },
];


export async function getConfigWorkLog() {
    return { statusCode: OK, data: { typeOfWorks, phaseOfWorkLogs } };
}

export async function addWorkLog(issue_key, comment, ticket_id, create_by_account, timeSpent, startDate, userName, userKey
    , typeOfWork, ot, phaseWorklog, jsessionid) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    const url = `http://180.93.175.189:30001/api/issue/${issue_key}/worklog/`;
    try {
        const objLogin = {
            comment,
            timeSpent,
            startDate,
            userName,
            userKey,
            typeOfWork,
            ot,
            phaseWorklog
        }
        const body = JSON.stringify(objLogin);
        let headers = {
            "Content-Type": "application/json",
            jsessionid
        }
        let requestOptions = {
            method: 'PUT',
            body: body,
            headers
        };
        let projectRes = await fetch(url, requestOptions)
            .then(response => response.json());
        myLogger.info(JSON.stringify(projectRes));
        let params = [
            comment,
            timeSpent,
            startDate,
            userName,
            userKey,
            ot,
            phaseWorklog,
            create_by_account,
            typeOfWork,
            ticket_id,
            issue_key
        ]
        let sql = `CALL addWorkLog(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        try {
            const result = await query(sql, params);
            let id = result[0][0].res;
            ret = {
                statusCode: OK, data: {
                    id,
                    comment,
                    timeSpent,
                    startDate,
                    userName,
                    userKey,
                    ot,
                    phaseWorklog,
                    create_by_account,
                    typeOfWork,
                    ticket_id,
                    issue_key
                }
            };
        } catch (error) {
            myLogger.info("login e: %o", error);
            ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
        }
    } catch (e) {
        myLogger.info("login e: %o", e);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'System busy!' };
    }
    return ret;
}


export async function addComment(ticket_id, content, created_by_account, issue_key, jsessionid) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    const url = `http://180.93.175.189:30001/api/issue/${issue_key}/comment/`;
    try {
        const objLogin = {
            content
        }
        const body = JSON.stringify(objLogin);
        let headers = {
            "Content-Type": "application/json",
            jsessionid
        }
        let requestOptions = {
            method: 'POST',
            body: body,
            headers
        };
        let projectRes = await fetch(url, requestOptions)
            .then(response => response.json());
        // myLogger.info(JSON.stringify(projectRes));
        let params = [
            ticket_id,
            content,
            created_by_account,
            issue_key
        ]
        let sql = `CALL addComment(?, ?, ?, ?)`
        try {
            const result = await query(sql, params);
            let id = result[0][0].res;
            ret = {
                statusCode: OK, data: {
                    id,
                    ticket_id,
                    content,
                    created_by_account,
                    issue_key
                }
            };
        } catch (error) {
            myLogger.info("login e: %o", error);
            ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
        }
    } catch (e) {
        myLogger.info("login e: %o", e);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'System busy!' };
    }
    return ret;
}


