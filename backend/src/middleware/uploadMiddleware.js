import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save images to the existing uploads/products directory
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using Date.now() and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, uniqueSuffix + "-" + basename + ext);
  },
});

export const uploadProductImage = multer({ storage });
