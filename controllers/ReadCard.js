import { BAD_REQUEST, OK, SYSTEM_ERROR } from "../constant/HttpResponseCode.js";
import myLogger from "../winstonLog/winston.js";
import query from "../helper/helperDb.js";


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


export async function checkIn(id_card, id_read_card, index_status) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let sql = `CALL checkInCard(?, ?, ?)`;
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
        var { HoanThanh, Hap, La, DongGoi, NhapKho, XuatKho } = result[0][0];
        myLogger.info("%o", result[0][0]);
        ret = {
            statusCode: OK, data: {
                HoanThanh, Hap, La, DongGoi, NhapKho, XuatKho
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
            let { Id_card, Id_read_card, index_status, Date_Created, date_updated } = e;
            details.push({ Id_card, Id_read_card, index_status, Date_Created, date_updated });
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
    { id: "HT", name: "Hoàn Thành" },
    { id: "LA", name: "Là" },
    { id: "HA", name: "Hấp" },
    { id: "DG", name: "Đóng Gói" },
    { id: "NK", name: "Nhập Kho" },
    { id: "XK", name: "Xuất Kho" },
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