import express from "express";
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/ProductController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadFoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProducts);
// Gunakan upload.single('image') untuk menangkap 1 file dengan field name 'image' dari FormData frontend
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.get('/:id', getProductById);
router.post('/', uploadFoto, createProduct);
router.patch('/:id', uploadFoto, updateProduct); // Ubah dari router.put menjadi router.patch
router.delete('/:id', deleteProduct);


export default router;