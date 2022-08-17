import express from 'express';
import { BAD_REQUEST, CREATED, NO_CONTENT, OK } from './constant/HttpResponseCode.js';
import customerRouter from './routers/Customer.js';
import staffRouter from './routers/Staff.js';
import myLogger from './winstonLog/winston.js';
import dotenv from 'dotenv';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import {swaggerDocument} from './swagger/swagger.js';
import {makeInfo} from './validator/InfoAPI.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/customer/', makeInfo,  customerRouter);
app.use('/staff/', makeInfo, staffRouter)
app.use('/swagger-powerapps',  swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use((data, req, res, next) => {
    let statusCode = data.statusCode;
    // myLogger.info(data)
    if (statusCode !== OK && statusCode !== CREATED && statusCode !== NO_CONTENT) {
        let { method, url } = req;
        // myLogger.info("Method:" + method + ", URl:" + url + ", Error: " + JSON.stringify(data), { label: "RESPONSE-ERROR" });
        res.status(statusCode||BAD_REQUEST).send({
            code: statusCode,
            error: data.data ? data.data : data.error,
            description: data.description
        })
    } else {
        let { method, url } = req;
        // myLogger.info("Method:" + method + ", URl:" + url + ", Data: %o", data.data, { label: "RESPONSE-OK" });
        // myLogger.info("Method:" + method + ", URl:" + url + ", Data: " + JSON.stringify(data.data), { label: "RESPONSE-OK" });
        res.status(statusCode).send(data.data)
    }
});
const port = process.env.API_CA_PORT || 3000
const host = '0.0.0.0';
function myListener() {
    myLogger.info(`Listening on port ${port}..`);
}
app.listen(port, host, myListener)