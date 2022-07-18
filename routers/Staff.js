import express from 'express';
import { loginByStaff } from '../controllers/LoginByStaff.js';
import { validateTokenCustomerAccess } from '../token/ValidateToken.js';
import myLogger from '../winstonLog/winston.js';
import { updateTicketByStaff, updateTicketStatusByStaff } from "../controllers/StaffController.js";

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

export default router;
