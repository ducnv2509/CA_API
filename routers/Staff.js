import express from 'express';
import { loginByStaff } from '../controllers/LoginByStaff.js';
import { validateTokenStaffAccess, refreshToken } from '../token/ValidateToken.js';
import myLogger from '../winstonLog/winston.js';
import { updateTicketByStaff, updateTicketStatusByStaff, updateTransferTicketByStaff, updateCommentByStaff, ticketStatusAllByStaff } from "../controllers/StaffController.js";
import { OK, SYSTEM_ERROR } from '../constant/HttpResponseCode.js';

const router = express.Router();


router.post('/login/', async (req, res, next) => {
    let { username, password } = req.body
    let response = await loginByStaff(username, password);
    next(response);
})

router.put('/updateTicket/', validateTokenStaffAccess, async (req, res, next) => {
    let { project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, request_type_id, id } = req.body;
    let { username } = req.payload;
    myLogger.info('%o', req.payload);
    let response = await updateTicketByStaff(username, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, request_type_id, id);
    next(response);
})
router.post('/updateStatusTicket/', validateTokenStaffAccess, async (req, res, next) => {
    let { ticket_id, new_status, note, date_activity, time_spent } = req.body;
    let { username } = req.payload;
    let response = await updateTicketStatusByStaff(ticket_id, username, new_status, note, date_activity, time_spent);
    next(response);
})

router.post('/updateTransferTicket/', validateTokenStaffAccess, async (req, res, next) => {
    let { ticket_id, new_group, new_assignee, time_spent, date_of_activity } = req.body;
    let { username } = req.payload;
    let response = await updateTransferTicketByStaff(ticket_id, new_group, new_assignee, time_spent, date_of_activity, username);
    next(response);
})

router.post('/updateCommentTicket/', validateTokenStaffAccess, async (req, res, next) => {
    let { ticket_id, note, date_activity, time_spent } = req.body;
    let { username } = req.payload;
    let response = await updateCommentByStaff(ticket_id, username, note, date_activity, time_spent);
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

export default router;
