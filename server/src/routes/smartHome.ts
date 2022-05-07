import express from "express";
const router = express.Router();
import * as db from "../controllers/smartHome";





// get data
router.get('/data', db.getData);

// get Serial Number dropdown list
router.get('/sns', db.getSerialNumbers);

// get Device ID dropdown list
router.get('/dids/:sn', db.getDeviceIDs);

// test query
router.get('/test', db.testQuery);


module.exports = router;