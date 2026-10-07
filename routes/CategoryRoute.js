import express from "express";
import { 
    getCategories, 
    getCategoriesLevel1, 
    getCategoriesByParent 
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get('/categories', getCategories);
router.get('/categories/level1', getCategoriesLevel1);
router.get('/categories/parent/:parentId', getCategoriesByParent);

export default router;