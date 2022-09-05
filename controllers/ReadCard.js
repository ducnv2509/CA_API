import { BAD_REQUEST, OK, SYSTEM_ERROR } from "../constant/HttpResponseCode.js";
import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";
import { formatDateFMT } from "../validator/ValidationUtil.js";
import { publicMobile } from "../Mqtt.js";


export async function readCard(id_card, id_read_card, index_status) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL readCard(?, ?, ?)`;
    try {
        let params = [id_card, id_read_card, index_status];
        const result = await query(sql, params);
        var { Id_card, Id_read_card, index_status, Date_Created, date_updated } = result[0][0];
        myLogger.info("%o", result[0][0]);
        ret = {
            statusCode: OK, data: {
                Id_card, Id_read_card, index_status, Date_Created, date_updated
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}



export async function updateStation(id_station, id_mac) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL updateStation(?, ?)`;
    try {
        let params = [id_mac, id_station];
        const result = await query(sql, params);
        let { name_station } = result[0][0]
        myLogger.info("%o", name_station);
        ret = {
            statusCode: OK, data: {
                station_type: id_station, id_mac
            }
        }
        publicMobile(`{'cmd':'UpdateStation', 'data':{'name':'${name_station}'}}`)
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}

export async function checkIn(id_card, id_read_card) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL checkInCard(?, ?)`;
    try {
        let params = [id_card, id_read_card, index_status];
        const result = await query(sql, params);
        var { Id_card, Id_read_card, index_status, Date_Created, date_updated } = result[0][0];
        myLogger.info("%o", result[0][0]);
        ret = {
            statusCode: OK, data: {
                Id_card, Id_read_card, index_status, Date_Created, date_updated
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}

export async function getProductByIdCard(id_card) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL getProductByIdCard(?)`;
    try {
        let params = [id_card];
        const result = await query(sql, params);
        var { id, id_card, name_product, image, date_created } = result[0][0];
        myLogger.info("%o", result[0][0]);
        ret = {
            statusCode: OK, data: {
                id, id_card, name_product, image, date_created
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}

export async function getQuantityByStation() {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL quantityByStation()`;
    try {
        const result = await query(sql);
        var { UI, NHT, XG, DT, NhapKho, XuatKho } = result[0][0];
        myLogger.info("%o", result[0][0]);
        ret = {
            statusCode: OK, data: {
                UI, NHT, XG, DT, NK: NhapKho, XK: XuatKho
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}


export async function getDeatilsStation(station) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL getDetailsIdCardByStation(?)`;
    try {
        let params = [station];
        const result = await query(sql, params);
        let res = result[0];
        myLogger.info("%o", res)
        let details = [];
        res.forEach(e => {
            let { id_card, Id_read_card, index_status, date_created, date_updated, name_product, image } = e;
            let dateC = formatDateFMT("YYYY-MM-DDTHH:mm:ss.sssZ", date_created)
            let dateU = formatDateFMT("YYYY-MM-DDTHH:mm:ss.sssZ", date_updated)
            details.push({ id_card, Id_read_card, index_status, date_created: dateC, date_updated: dateU, name_product, image });
        });
        myLogger.info("%o", result);
        ret = {
            statusCode: OK, data: {
                details
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}

export async function listStation() {
    return { statusCode: OK, data: { station } };
}

const station = [
    { Order: 1, id: "UI", name: "Ủi" },
    { Order: 2, id: "NHT", name: "Nhập Hoàn Thành" },
    { Order: 3, id: "XG", name: "Xếp Gói" },
    { Order: 4, id: "DT", name: "Đóng Thùng" },
    { Order: 5, id: "NK", name: "Nhập Kho" },
    { Order: 6, id: "XK", name: "Xuất Kho" },
];


export async function getStationByReader(id_card, id_reader) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL getStationByReader(?, ?)`;
    try {
        let params = [id_card, id_reader];
        const result = await query(sql, params);
        var { index_status } = result[0][0];
        myLogger.info("%o", result[0][0]);
        ret = {
            statusCode: OK, data: {
                index_status
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}


export async function getStationInfo(id_mac) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL getStationInfo(?)`;
    try {
        let params = [id_mac];
        const result = await query(sql, params);
        var { id_mac, name_station, station_type } = result[0][0];
        myLogger.info("%o", result[0][0]);
        ret = {
            statusCode: OK, data: {
                id_mac, name_station, station_type
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}


export async function getAllProducts() {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL getAllProduct()`;
    try {
        const result = await query(sql);
        let res = result[0];
        myLogger.info("%o", res)
        let details = [];
        res.forEach(e => {
            let { id_card, Id_read_card, index_status, date_created, date_updated, name_product, image } = e;
            let dateC = formatDateFMT("YYYY-MM-DDTHH:mm:ss.sssZ", date_created)
            let dateU = formatDateFMT("YYYY-MM-DDTHH:mm:ss.sssZ", date_updated)
            myLogger.info("%o", e);
            details.push({ id_card, Id_read_card, index_status, date_created: dateC, date_updated: dateU, name_product, image });
        });
        ret = {
            statusCode: OK, data: {
                details
            }
        }
    } catch (error) {
        myLogger.info("login e: %o", error);
        ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'Insert DB error!' };
    }
    return ret;
}