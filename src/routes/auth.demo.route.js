import express from "express";
import authDemoController from "../controllers/auth.demo.controller.js";

const authDemoRouter = express.Router();

authDemoRouter.post("/login", ...authDemoController.loginDemo);
authDemoRouter.post("/logout", ...authDemoController.logoutDemo);

export default authDemoRouter; 