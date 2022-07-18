import express from 'express';
import { CREATED, NO_CONTENT, OK } from './constant/HttpResponseCode.js';
import customerRouter from './routers/Customer.js';
import staffRouter from './routers/Staff.js';
import myLogger from './winstonLog/winston.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


const app = express();
app.use(express.json());
// app.use('/api/', mainRoutes);
app.use('/customer/', customerRouter);
app.use('/staff/', staffRouter)
app.use(cors());

app.use((data, req, res, next) => {
    let statusCode = data.statusCode;
    if (statusCode !== OK && statusCode !== CREATED && statusCode !== NO_CONTENT) {
        let { method, url } = req;
        myLogger.info("Method:" + method + ", URl:" + url + ", Error: " + JSON.stringify(data), { label: "RESPONSE-ERROR" });
        res.status(statusCode).send({
            code: statusCode,
            error: data.data ? data.data : data.error,
            description: data.description
        })
    } else {
        let { method, url } = req;
        myLogger.info("Method:" + method + ", URl:" + url + ", Data: %o", data.data, { label: "RESPONSE-OK" });
        // myLogger.info("Method:" + method + ", URl:" + url + ", Data: " + JSON.stringify(data.data), { label: "RESPONSE-OK" });
        res.status(statusCode).send(data.data)
    }
});
const port = process.env.API_CA_PORT || 3000
const host = '0.0.0.0';
function myListener(){
    myLogger.info(`Listening on port ${port}..`);
}
app.listen(port, host, myListener)