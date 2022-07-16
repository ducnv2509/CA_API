import express from 'express';
import { getListCustomer, insertTicketByCustomer } from '../controllers/CustomerController.js';
import {loginByCustomer} from '../controllers/LoginByCustomerController.js';
import {validateTokenCustomerAccess} from '../token/ValidateToken.js';
import myLogger from '../winstonLog/winston.js';



const router = express.Router();

router.get('/getCustomer/', validateTokenCustomerAccess, async (req, res,next) => {
    let response = await getListCustomer();
    next(response);
    // res.status(200).send(response);
})

router.post('/insertTicket/',validateTokenCustomerAccess,  async (req, res,next) => {
    let { project_id, email, phone, resolved_date, summary, description } = req.body;
    let {username} = req.payload;
    myLogger.info('%o', req.payload);
    let response = await insertTicketByCustomer(username, project_id, email, phone, resolved_date, summary, description);
    // res.status(200).send(response);
    next(response);
})

router.post('/login/', async (req, res,next) => {
    let { username, password } = req.body
    let response = await loginByCustomer(username, password);
    next(response);
    // res.status(200).send(response);
})


export default router;
