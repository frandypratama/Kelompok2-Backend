import express from "express";
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/ProductController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/', getProducts);
// Gunakan upload.single('image') untuk menangkap 1 file dengan field name 'image' dari FormData frontend
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


export default router;