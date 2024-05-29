import {onRequest} from "firebase-functions/v1/https";
import * as logger from "firebase-functions/logger";
import {getDatabase} from "firebase-admin/database";

export const userUpdate = onRequest(async (request, response) => {
    logger.info(`LOG: userUpdate() begins with request: ${request.query.name}`);

    const uid = request.query.uid;
    const name = request.query.name;

    const rtdb = getDatabase();
    await rtdb.ref(`users/${uid}`).update({name});

    response.send({code: 200, message: "OK"});
});

