import express, { Application, Request, Response, NextFunction } from "express";
import * as db from "./queries";
import cors from "cors";

const app:Application = express();

const PORT = process.env.PORT || 5000;


app.use(cors());

app.get('/', (req: Request, res:Response, next: NextFunction) => {
  res.json({"message": "Hello, welcome to SHDV server!"});
});


// new getdata api
app.get('/api/data', db.getData);

// SN dropdown list query
app.get('/api/sns', db.getSerialNumbers);

// DID dropdown list query
app.get('/api/dids/:sn', db.getDeviceIDs);

// test query
app.get('/api/test', db.testQuery);

// get all data, limit 5 use for test
app.get('/api/all', db.getAllData);



app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});