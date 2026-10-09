import express from "express";
import { 
    createTransaction, 
    getTransactions,
    getTransactionById
} from "../controllers/TransactionController.js";

const router = express.Router();

router.get('/', getTransactions);       // Mengambil riwayat transaksi
router.get('/:id', getTransactionById);    // Mengambil transaksi tertentu berdasarkan ID
router.post('/', createTransaction);    // Melakukan checkout kasir / transaksi baru

export default router;