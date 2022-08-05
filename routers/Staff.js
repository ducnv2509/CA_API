import express from 'express';
import { findByUser, loginByStaff, loginByStaffNew } from '../controllers/LoginByStaff.js';
import { validateTokenStaffAccess, refreshToken } from '../token/ValidateToken.js';
import myLogger from '../winstonLog/winston.js';
import { ticketStatusAllByStaff, createTicketByStaff, getDetailsTicket, getTimeSpent, getAllProjects, sendMail, getTicketConfig, getNameComponentByProject, getUpdateStatus, updateTicketStatusByStaffNew, getConfigWorkLog, addWorkLog, addComment, updateTransferTicketNew, listStatusTicket } from "../controllers/StaffController.js";
import { OK, SYSTEM_ERROR } from '../constant/HttpResponseCode.js';
import { createTicketByStaffValidate, loginValidate, updateCommentTicketValidate, updateTicketValidateByStaff, updateTransferTicketValidate } from '../validator/Validator.js';
const router = express.Router();


router.put('/updateTransferTicket/:issue_id', validateTokenStaffAccess, async (req, res, next) => {
    let { ticket_id, new_assignee, note, time_spent } = req.body;
    let { username, jsessionid } = req.payload;
    let { issue_id } = req.params;
    let response = await updateTransferTicketNew(ticket_id, 1, new_assignee, time_spent, note, new Date(), username, issue_id, jsessionid);
    next(response);
})


router.get('/ticketStatusAllByStaff/', validateTokenStaffAccess, async (req, res, next) => {
    let { username } = req.payload;
    let response = await ticketStatusAllByStaff(username);
    next(response);
})

router.post("/refresh-token/", async (req, res, next) => {
    let { refreshtoken } = req.headers;
    let data = refreshToken(refreshtoken);
    let { status, accessToken } = data
    if (status === true) {
        next({ statusCode: OK, data: { accessToken } });
    } else {
        next({ statusCode: SYSTEM_ERROR, error: 'SYSTEM_ERROR', description: 'system error ne!!!' });
    }
});

router.post('/createTicketByStaff/', validateTokenStaffAccess, createTicketByStaffValidate, async (req, res, next) => {
    let {
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
        assignee_name } = req.body;
    let { username, jsessionid } = req.payload;
    let response = await createTicketByStaff(username, customer_name,
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
        assignee_name, jsessionid);
    next(response);
})

router.get('/getDetailsTicket/:Id', validateTokenStaffAccess, async (req, res, next) => {
    let { Id } = req.params;
    let { username, jsessionid } = req.payload;

    let response = await getDetailsTicket(Id, username, jsessionid);
    next(response);
})

router.get('/getTimeSpent/', validateTokenStaffAccess, async (req, res, next) => {
    let { username } = req.payload;
    let response = await getTimeSpent(username);
    next(response);
})

router.get('/getAllProjects/', validateTokenStaffAccess, async (req, res, next) => {
    let response = await getAllProjects();
    next(response);
})

router.post('/sendMail', async (req, res, next) => {
    let { email } = req.body;
    let response = sendMail(email);
    next(response);
})

router.post('/login/', loginValidate, async (req, res, next) => {
    let { username, password } = req.body
    let response = await loginByStaffNew(username.trim(), password);
    next(response);
})

router.get('/findByUser/:username', validateTokenStaffAccess, async (req, res, next) => {
    let { username } = req.params;
    let { jsessionid } = req.payload
    let response = await findByUser(username, jsessionid);
    next(response);
})

router.get('/getConfigTicket/', validateTokenStaffAccess, async (req, res, next) => {
    let response = await getTicketConfig();
    next(response);
})

router.get('/project/:project_id/component', validateTokenStaffAccess, async (req, res, next) => {
    let { project_id } = req.params;
    let response = await getNameComponentByProject(project_id);
    next(response);
})

router.get('/getIssueId/:id', validateTokenStaffAccess, async (req, res, next) => {
    let { id } = req.params;
    let { jsessionid } = req.payload
    let response = await getUpdateStatus(id, jsessionid);
    next(response);
})

router.put('/ticket/:id/transition/', validateTokenStaffAccess, async (req, res, next) => {
    let { id } = req.params;
    let { status, ticket_id } = req.body
    let { jsessionid, username } = req.payload
    let response = await updateTicketStatusByStaffNew(
        ticket_id, username, 'Update Status by Ticket: ' + ticket_id, new Date(), "comming",
        id, status, jsessionid);
    next(response);
})

router.get('/getConfigWorkLog/', validateTokenStaffAccess, async (req, res, next) => {
    let response = await getConfigWorkLog();
    next(response);
})

router.get('/listStatus/', validateTokenStaffAccess, async (req, res, next) => {
    let response = await listStatusTicket();
    next(response);
})

router.put('/addWorkLog/:issue_key/', validateTokenStaffAccess, async (req, res, next) => {
    let {
        comment,
        timeSpent,
        startDate,
        ot,
        phaseWorklog,
        typeOfWork,
        ticket_id,
    } = req.body;
    let { issue_key } = req.params;
    let { username, jsessionid, full_name } = req.payload;
    let response = await addWorkLog(
        issue_key, comment, ticket_id, username, timeSpent, startDate, full_name, username
        , typeOfWork, ot, phaseWorklog, jsessionid);
    next(response);
})

router.post('/addComment/:issue_key', validateTokenStaffAccess, async (req, res, next) => {
    let { issue_key } = req.params;
    let { ticket_id, content } = req.body
    let { jsessionid, username } = req.payload
    let response = await addComment(
        ticket_id,
        content, username, issue_key, jsessionid
    );
    next(response);
})

export default router;
