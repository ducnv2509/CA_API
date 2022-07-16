import express from 'express';
import { loginByStaff } from '../controllers/LoginByStaff.js';
import { validateTokenCustomerAccess } from '../token/ValidateToken.js';
import myLogger from '../winstonLog/winston.js';
import { updateTicketByStaff } from "../controllers/StaffController.js";

const router = express.Router();


router.post('/login/', async (req, res, next) => {
    let { username, password } = req.body
    let response = await loginByStaff(username, password);
    next(response);
})

router.put('/updateTicket/', validateTokenCustomerAccess, async (req, res, next) => {
    let { category_id, group_id, priority_id, scope, assignee_id, id } = req.body;
    let { username } = req.payload;
    myLogger.info('%o', req.payload);
    let response = await updateTicketByStaff(username, category_id, group_id, priority_id, scope, assignee_id, id);
    next(response);
})

export default router;
