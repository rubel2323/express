import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool, Query } from "pg";
const app: Application = express();

//information from config files
import config from "./config/config";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.router";
import { profileRoute } from "./modules/profile/profile.route";

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

//middleware with neonDb and server
app.use("/api/users/", userRoute);
app.use("/api/profile/", profileRoute);

export default app;
