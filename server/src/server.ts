import express, { Application, Request, Response, NextFunction } from "express";

import cors from "cors";
const smartHomeRouter = require("./routes/smartHome")

const app:Application = express();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use('/api', smartHomeRouter);

app.get('/', ( req: Request, res:Response ) => {
  res.json({"message": "Welcome to SHDV server!"});
});


// // new getdata api
// app.get('/api/data', db.getData);

// // Serial Number dropdown list query
// app.get('/api/sns', db.getSerialNumbers);

// // Device ID dropdown list query
// app.get('/api/dids/:sn', db.getDeviceIDs);

// // test query
// app.get('/api/test', db.testQuery);



app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});