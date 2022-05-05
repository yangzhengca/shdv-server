import express, { Application, Request, Response, NextFunction } from "express";
import * as db from "./queries";

const app:Application = express();

const PORT = process.env.PORT || 5000;




app.get('/', (req: Request, res:Response, next: NextFunction) => {
  res.json({"message": "Hello, welcome to SHDV server!"});
});

// test query
app.get('/api/test', db.testQuery);

// get all data, limit 5
app.get('/api/all', db.getAllData);



app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});