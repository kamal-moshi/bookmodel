import { startServer } from "../db/startserver.mjs";

import app from "./app.mjs";
import * as dotenv from "dotenv";
dotenv.config();

const {port,uri}= process.env;



startServer(app,port,uri);