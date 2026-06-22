import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import productImageRoutes from "./routes/productImageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/:productId/images", productImageRoutes);

app.use("/api/categories", categoriesRoutes);

app.use(errorMiddleware);

export default app;
