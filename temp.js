import express from 'express';
import {SerialPort} from "serialport";
const app = express();

let port = 3001;

let arduinoCOMPort = "/dev/ttyS1";

let arduinoSerialPort = new SerialPort({path: arduinoCOMPort,
    baudRate: 9600,
 dataBits: 8,
 stopBits: 1,
 parity: 'none',
 autoOpen: true,

});

arduinoSerialPort.on('open',function() {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

app.get('/status', function (req, res) {
    arduinoSerialPort.write("$426\n");
    return res.send('Working');
 
})

app.get('/control', function (req, res) {
    let {state} = req.query;
    let cmd = `#42100${state}\n`
    arduinoSerialPort.write(cmd);
    return res.send('Working');
 
})

app.get('/:action', function (req, res) {
    
   let action = req.params.action || req.param('action');
    
    if(action == 'led'){
        arduinoSerialPort.write("w");
        return res.send('Led light is on!');
    } 
    if(action == 'off') {
        arduinoSerialPort.write("t");
        return res.send("Led light is off!");
    }
    
    return res.send('Action: ' + action);
 
});

app.listen(port, function () {
  console.log('Example app listening on port http://0.0.0.0:' + port + '!');
});