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


export const testQuery = ( req: Request, res: Response ): void => {
  
  const sql: string = `SELECT DISTINCT count("Device_ID","Device_Name" FROM readings`;
  
  pool.query(sql, (error: Error, results: any) => {
    if ( error ) {
      console.error('Error executing query', error.stack);
    };

    res.status(200).json(results.rows);
  })
};


// get the top 5 records of the table
export const getAllData = ( req: Request, res: Response ): void => {
  
  const sql: string = `SELECT * FROM readings LIMIT 5`;
  
  pool.query(sql, (error: Error, results: any) => {
    if ( error ) {
      console.error('Error executing query', error.stack);
    };

    res.status(200).json(results.rows);
  })
};



