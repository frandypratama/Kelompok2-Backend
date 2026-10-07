import express from "express";
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get('/', getCategories);              // Mengambil semua kategori bertingkat
router.post('/', createCategory);           // Menambah kategori baru
router.put('/:id', updateCategory);         // Mengubah kategori berdasarkan ID
router.delete('/:id', deleteCategory);      // Menghapus kategori berdasarkan ID

export default router;