import { getAllProducts, getProductById } from "../services/productService.js";

export async function getProducts(req, res) {
  try {
    const products = await getAllProducts();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
