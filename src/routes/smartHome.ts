import express from "express";
const router = express.Router();
import * as db from "../controllers/smartHome";


// get data
router.get('/data', db.getDataCache, db.getData);

// get Serial Numbers
router.get('/sns', db.getSerialNumbersCache, db.getSerialNumbers);

// get device IDs which has chosen serial number
router.get('/dids/:sn', db.getDeviceIDs);

// // used for testing postgresql database
// router.get('/test', db.testQuery);


module.exports = router;