import express from "express";
import wss from "./websocket/wsServer.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// const connectDB = require("./config/db");
const port = process.env.PORT || 3001;
const app = express();
// connectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
