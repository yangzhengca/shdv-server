"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const smartHomeRouter = require("./routes/smartHome");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use('/api', smartHomeRouter);
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to SHDV server!" });
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
