
import mqtt from 'mqtt';
import myLogger from './winstonLog/winston.js';

let client = mqtt.connect('mqtt://180.93.175.236')
client.on("connect", function () {
    console.log("connected");
})

export function publicMobile(data) {
    myLogger.info("%o", !client)
    client.publish("mobile", (data))
}