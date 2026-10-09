import express from "express";
import { getFinancialReport } from "../controllers/ReportController.js";

const router = express.Router();

router.get('/reports/financial', getFinancialReport);

export default router;