import { Request, Response, NextFunction } from "express";
const Pool = require("pg").Pool;
import fs from "fs";

// Provided database information
// `host=smarthomes.postgres.database.azure.com port=5432 dbname=wattage user=smarthomesdashboarduser@smarthomes password=b5zT;q_fS\aAUtpD sslmode=require`

// PostgreSQL connect config and create pool
const pool = new Pool({
  host: "smarthomes.postgres.database.azure.com",
  port: 5432,
  database: "wattage",
  user: "smarthomesdashboarduser@smarthomes",
  password: "b5zT;q_fS\\aAUtpD",
  sslmode: require,
  ssl: {
    rejectUnauthorized: false,
    cert: fs.readFileSync("./BaltimoreCyberTrustRoot.crt.pem").toString(),
  },
});


// get data from database and send to api
export const getData = (req: Request, res: Response): void => {

  if (
    req.query.serialNumber == "undefined" &&
    req.query.deviceID == "undefined"
  ) {
    const sql: string = `SELECT SUM("Wattage") AS "Wattage", "DateTime"
    FROM readings GROUP BY "DateTime" ORDER BY "DateTime";`;

    pool.query(sql, (error: Error, results: any) => {
      if (error) {
        console.error("Error executing query", error.stack);
      }
      res.status(200).json(results.rows);
    });
  } else if (req.query.serialNumber !== "undefined" &&
  req.query.deviceID == "undefined") {
    const sql: string = `SELECT SUM("Wattage") AS "Wattage", "DateTime"
    FROM readings WHERE "Serial_Number"=$1 GROUP BY "DateTime" ORDER BY "DateTime";`;

    pool.query(sql, [`${req.query.serialNumber}`], (error: Error, results: any) => {
      if (error) {
        console.error("Error executing query", error.stack);
      }
      res.status(200).json(results.rows);
    });
  } else if(req.query.serialNumber !== "undefined" &&
  req.query.deviceID !== "undefined") {
    const sql: string = `SELECT SUM("Wattage") AS "Wattage", "DateTime"
    FROM readings WHERE "Serial_Number"=$1 AND "Device_ID"=$2 GROUP BY "DateTime" ORDER BY "DateTime";`;

    pool.query(sql, [`${req.query.serialNumber}`,`${req.query.deviceID}`], (error: Error, results: any) => {
      if (error) {
        console.error("Error executing query", error.stack);
      }
      res.status(200).json(results.rows);
    });
  } else {
    res.status(400).json({error: "Wrong query string!"});
  }

};

// get all serial number for client dropdown
export const getSerialNumbers = (req: Request, res: Response): void => {
  const sql: string = `SELECT DISTINCT "Serial_Number" FROM readings`;

  pool.query(sql, (error: Error, results: any) => {
    if (error) {
      console.error("Error executing query", error.stack);
    }
    type SNObject = {
      Serial_Number: string;
    };
    const data = results.rows.map((item: SNObject) => item.Serial_Number);

    res.status(200).json(data);
  });
};

// get all device IDs of chosen serial number for client dropdown
export const getDeviceIDs = (req: Request, res: Response): void => {
  const SN = req.params.sn;

  const sql: string = `SELECT DISTINCT "Device_ID" FROM readings WHERE "Serial_Number" = $1`;

  pool.query(sql, [`${SN}`], (error: Error, results: any) => {
    if (error) {
      console.error("Error executing query", error.stack);
    }
    type DIDObject = {
      Device_ID: string;
    };
    // filter device IDs only contain meaningful data, but device ID will have only two value, than there is no use to make this call
    // const data = results.rows.map((item: DIDObject) => item.Device_ID).filter((item: string) => item == "mains" || item == "always_on");

    // return all queried device IDs
    const data = results.rows.map((item: DIDObject) => item.Device_ID)
    
    res.status(200).json(data);
  });
};

// used for test
export const testQuery = (req: Request, res: Response): void => {
  const sql: string = `SELECT "Serial_Number" FROM readings WHERE "Device_ID"=$1`;

  pool.query(sql, [`6dec0c5e`],(error: Error, results: any) => {
    if (error) {
      console.error("Error executing query", error.stack);
    }
    type SNObject = {
      Serial_Number: string;
    };
    const data = results.rows.map((item: SNObject) => item.Serial_Number);
    // console.log(data);

    res.status(200).json(data);

    // res.json(results.rows);
  });
};


