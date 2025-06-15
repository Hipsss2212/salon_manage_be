import express from "express";

import paymentRouter from "./payment.routes.js";
import productRouter from './product.route.js';


const apiRoute = express.Router();

apiRoute.use("/payment", paymentRouter);
apiRoute.use('/products', productRouter);


export default apiRoute;
