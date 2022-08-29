import express from 'express';
import { checkIn, getDeatilsStation, getProductByIdCard, getQuantityByStation, getStationByReader, getStationInfo, listStation, readCard, updateStation } from '../controllers/ReadCard.js';
import myLogger from '../winstonLog/winston.js';

const router = express.Router();

router.post('/updateStation', async (req, res, next) => {
    let { id, name } = req.body;
    let response = await updateStation(id, name, '98:D3:31:FD:05:D0');
    next(response);
})

router.post('/checkIn', async (req, res, next) => {
    let { id_card, id_read_card } = req.body;
    let response = await checkIn(id_card, id_read_card);
    next(response);
})

router.get('/getProduct/:id', async (req, res, next) => {
    let { id } = req.params;
    let response = await getProductByIdCard(id);
    next(response);
})

router.get('/getQuantityByStation', async (req, res, next) => {
    let response = await getQuantityByStation();
    next(response);
})

router.get('/getDetailsStation/:id', async (req, res, next) => {
    let { id } = req.params;
    let response = await getDeatilsStation(id);
    next(response);
})

router.get('/getStations', async (req, res, next) => {
    let response = await listStation();
    next(response);
})

router.get('/getStation/:card/:reader', async (req, res, next) => {
    let { card, reader } = req.params;
    let response = await getStationByReader(card, reader);
    next(response)
})

router.get('/getStationInfo', async (req, res, next) => {
    // let { id_mac } = req.params;
    let response = await getStationInfo('98:D3:31:FD:05:D0');
    next(response)
})
export default router;
