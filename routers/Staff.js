import express from 'express';
import { loginByStaff } from '../controllers/LoginByStaff.js';
import { validateTokenCustomerAccess } from '../token/ValidateToken.js';
import myLogger from '../winstonLog/winston.js';
import { updateTicketByStaff, updateTicketStatusByStaff, updateTransferTicketByStaff, updateCommentByStaff } from "../controllers/StaffController.js";

const router = express.Router();


router.post('/login/', async (req, res, next) => {
    let { username, password } = req.body
    let response = await loginByStaff(username, password);
    next(response);
})

router.put('/updateTicket/', validateTokenCustomerAccess, async (req, res, next) => {
    let { project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, id } = req.body;
    let { username } = req.payload;
    myLogger.info('%o', req.payload);
    let response = await updateTicketByStaff(username, project_id, group_id, priority_id, scope, summary, description_by_staff, assignee_id, status_id, id);
    next(response);
})
router.post('/updateStatusTicket/', validateTokenCustomerAccess, async (req, res, next) => {
    let { ticket_id, new_status, note, date_activity, time_spent, activity_type } = req.body;
    let { username } = req.payload;
    let response = await updateTicketStatusByStaff(ticket_id, username, new_status, note, date_activity, time_spent, activity_type);
    next(response);
})

router.post('/updateTransferTicket/', validateTokenCustomerAccess, async (req, res, next) => {
    let { ticket_id, new_group, new_assignee, time_spent, date_of_activity } = req.body;
    let { username } = req.payload;
    let response = await updateTransferTicketByStaff(ticket_id, new_group, new_assignee, time_spent, date_of_activity, username);
    next(response);
})

router.post('/updateCommentTicket/', validateTokenCustomerAccess, async (req, res, next) => {
    let { ticket_id, note, date_activity, time_spent } = req.body;
    let { username } = req.payload;
    let response = await updateCommentByStaff(ticket_id, username, note, date_activity, time_spent);
    next(response);
})

export default router;
