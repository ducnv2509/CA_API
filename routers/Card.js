import express from 'express';
import { checkIn, getDeatilsStation, getProductByIdCard, getQuantityByStation, getStationByReader, listStation, readCard } from '../controllers/ReadCard.js';
import myLogger from '../winstonLog/winston.js';

const router = express.Router();

router.post('/readCard', async (req, res, next) => {
    let { id_card, id_read_card, index_status } = req.body;
    let response = await readCard(id_card, id_read_card, index_status);
    next(response);
})

router.post('/checkIn', async (req, res, next) => {
    let { id_card, id_read_card, index_status } = req.body;
    let response = await checkIn(id_card, id_read_card, index_status);
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
export default router;
