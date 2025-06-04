import express from "express";

import paymentRouter from "./payment.routes.js";


const apiRoute = express.Router();

apiRoute.use("/payment", paymentRouter);


export default apiRoute;
