import { Request, Response, NextFunction } from "express";
const Pool = require("pg").Pool;
import { QueryResult } from 'pg'
import fs from "fs";
import NodeCache from "node-cache";
require('dotenv').config()


// Initialize node-cache
const myCache = new NodeCache({ stdTTL : 3600 });

// PostgreSQL connect config and create pool
const pool = new Pool({
  host: "smarthomes.postgres.database.azure.com",
  port: 5432,
  database: "wattage",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  sslmode: require,
  ssl: {
    rejectUnauthorized: false,
    cert: fs.readFileSync("./BaltimoreCyberTrustRoot.crt.pem").toString(),
  },
});


// get data from database and send to api
export const getData = (req: Request, res: Response): void => {
  // calculate offset value
  const offSet = (Number(req.query.page)-1)*1440;

  // only have serial number in query string
  if (req.query.serialNumber !== "" &&
  req.query.deviceID == "") {
    const sql: string = `SELECT SUM("Wattage") AS "Wattage", "DateTime"
    FROM readings WHERE "Serial_Number"=$1 GROUP BY "DateTime" ORDER BY "DateTime" DESC OFFSET ${offSet} LIMIT 1440;`;

    pool.query(sql, [`${req.query.serialNumber}`], (error: Error, results: QueryResult) => {
      if (error) {
        console.error("Error executing query", error.stack);
      }
      myCache.set(`${req.query.page}-${req.query.serialNumber}-${req.query.deviceID}`, results.rows);
      res.status(200).json(results.rows);
    });
  } else if( req.query.serialNumber !== "" &&
  req.query.deviceID !== "" ) {
    // have both serial number and device ID in query string
    const sql: string = `SELECT SUM("Wattage") AS "Wattage", "DateTime"
    FROM readings WHERE "Serial_Number"=$1 AND "Device_ID"=$2 GROUP BY "DateTime" ORDER BY "DateTime" DESC OFFSET ${offSet} LIMIT 1440;`;

    pool.query(sql, [`${req.query.serialNumber}`,`${req.query.deviceID}`], (error: Error, results: QueryResult) => {
      if (error) {
        console.error("Error executing query", error.stack);
      }
      myCache.set(`${req.query.page}-${req.query.serialNumber}-${req.query.deviceID}`, results.rows);
      res.status(200).json(results.rows);
    });
  } else {
    // with no serial number or device ID in query string. (the situation which only have device ID in query string has prevent by the client logic. if use postman to override that, will return all data)
    const sql: string = `SELECT SUM("Wattage") AS "Wattage", "DateTime"
    FROM readings GROUP BY "DateTime" ORDER BY "DateTime" DESC OFFSET ${offSet} LIMIT 1440;`;

    pool.query(sql, (error: Error, results: QueryResult) => {
      if (error) {
        console.error("Error executing query", error.stack);
      }
      myCache.set(`${req.query.page}-${req.query.serialNumber}-${req.query.deviceID}`, results.rows);
      res.status(200).json(results.rows);
    });
  }

};

// get data from cache middleware 
export const getDataCache = ( req: Request, res: Response, next: NextFunction ) => {
  if (myCache.has(`${req.query.page}-${req.query.serialNumber}-${req.query.deviceID}`)) {
    return res.status(200).send(myCache.get(`${req.query.page}-${req.query.serialNumber}-${req.query.deviceID}`));
  } else {
    next();
  }  
}

// get all serial numbers
export const getSerialNumbers = (req: Request, res: Response): void => {
  const sql: string = `SELECT DISTINCT "Serial_Number" FROM readings`;

  pool.query(sql, (error: Error, results: QueryResult) => {
    if (error) {
      console.error("Error executing query", error.stack);
    }
    type SNObject = {
      Serial_Number: string;
    };
    const data = results.rows.map((item: SNObject) => item.Serial_Number);
    myCache.set('SNs', data);
    res.status(200).json(data);
  });
};
// get all serial numbers cache middleware 
export const getSerialNumbersCache = ( req: Request, res: Response, next: NextFunction ) => {
  if ( myCache.has("SNs") ) {
    return res.status(200).send(myCache.get("SNs"));
  } else {
    next();
  }
}

// get device IDs which has chosen serial number
export const getDeviceIDs = (req: Request, res: Response): void => {
  const SN = req.params.sn;

  const sql: string = `SELECT DISTINCT "Device_ID" FROM readings WHERE "Serial_Number" = $1`;

  pool.query(sql, [`${SN}`], (error: Error, results: QueryResult) => {
    if (error) {
      console.error("Error executing query", error.stack);
    }
    type DIDObject = {
      Device_ID: string;
    };
    // filter device IDs only contain meaningful data, but device ID will have only two value, than there is no use to make this call.  
    // const data = results.rows.map((item: DIDObject) => item.Device_ID).filter((item: string) => item == "mains" || item == "always_on");

    // return all queried device IDs
    const data = results.rows.map((item: DIDObject) => item.Device_ID)
    myCache.set(`${SN}-DIDs`, data);
    res.status(200).json(data);
  });
};

// get device IDs which has chosen serial number cache middleware 
export const getDeviceIDsCache = ( req: Request, res: Response, next: NextFunction ) => {
  const SN = req.params.sn;
  if ( myCache.has(`${SN}-DIDs`) ) {
    return res.status(200).send(myCache.get(`${SN}-DIDs`));
  } else {
    next();
  }
}


