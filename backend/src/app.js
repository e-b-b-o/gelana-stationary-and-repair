import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.use(errorMiddleware);

export default app;
