import { Request, Response, NextFunction } from "express";
const Pool = require('pg').Pool;
import fs from 'fs';

// Provided database information
// `host=smarthomes.postgres.database.azure.com port=5432 dbname=wattage user=smarthomesdashboarduser@smarthomes password=b5zT;q_fS\aAUtpD sslmode=require`

const pool = new Pool({
  host: "smarthomes.postgres.database.azure.com", 
  port: 5432, 
  database: "wattage", 
  user: "smarthomesdashboarduser@smarthomes", 
  password: "b5zT;q_fS\\aAUtpD",
  sslmode: require,
  ssl: {
    rejectUnauthorized: false,
    cert: fs.readFileSync('./BaltimoreCyberTrustRoot.crt.pem').toString(),
  }
});

// export const getDeviceID = ( req: Request, res: Response ): void => {
  
//   const sql: string = `SELECT DISTINCT "Serial_Number" FROM readings`;
  
//   pool.query(sql, (error: Error, results: any) => {
//     if ( error ) {
//       console.error('Error executing query', error.stack);
//     };
//     type SNObject = {
//       Serial_Number: string;
//     }
//     const data = results.rows.map((item: SNObject) => item.Serial_Number);
//     // console.log(data);    

//     res.status(200).json(data);

//     // res.json(results.rows);
//   })
// };

export const getData = ( req: Request, res: Response ): void => {
  const SN = req.params.sn;

  const sql: string = `SELECT "Wattage", "DateTime", "Device_ID" FROM readings WHERE  "Serial_Number"=$1`;
  
  pool.query(sql, [`${SN}`], (error: Error, results: any) => {
    if ( error ) {
      console.error('Error executing query', error.stack);
    };
    // type SNObject = {
    //   Serial_Number: string;
    // }
    // const data = results.rows.map((item: SNObject) => item.Serial_Number);
    // console.log(data);    

    // res.status(200).json(data);

    res.json(results.rows);
  })
};


export const getSN = ( req: Request, res: Response ): void => {
  
  const sql: string = `SELECT DISTINCT "Serial_Number" FROM readings`;
  
  pool.query(sql, (error: Error, results: any) => {
    if ( error ) {
      console.error('Error executing query', error.stack);
    };
    type SNObject = {
      Serial_Number: string;
    }
    const data = results.rows.map((item: SNObject) => item.Serial_Number);
    // console.log(data);    

    res.status(200).json(data);

    // res.json(results.rows);
  })
};

export const testQuery = ( req: Request, res: Response ): void => {
  
  const sql: string = `SELECT DISTINCT "Serial_Number" FROM readings`;
  
  pool.query(sql, (error: Error, results: any) => {
    if ( error ) {
      console.error('Error executing query', error.stack);
    };
    type SNObject = {
      Serial_Number: string;
    }
    const data = results.rows.map((item: SNObject) => item.Serial_Number);
    // console.log(data);    

    res.status(200).json(data);

    // res.json(results.rows);
  })
};


// get the top 5 records of the table
export const getAllData = ( req: Request, res: Response ): void => {
  
  const sql: string = `SELECT "Wattage", "DateTime", "Device_ID" FROM readings`;
  
  pool.query(sql, (error: Error, results: any) => {
    if ( error ) {
      console.error('Error executing query', error.stack);
    };

    res.status(200).json(results.rows);
  })
};



