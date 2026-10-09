import { Transaction, TransactionDetail } from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import { Op } from "sequelize";

// Laporan Keuangan & Penjualan dengan Filterisasi
export const getFinancialReport = async (req, res) => {
    try {
        const { start_date, end_date, user_id } = req.query;

        // Kondisi filter
        let whereCondition = {};

        // 1. Filter Rentang Tanggal (Format: YYYY-MM-DD)
        if (start_date && end_date) {
            whereCondition.createdAt = {
                [Op.between]: [`${start_date} 00:00:00`, `${end_date} 23:59:59`]
            };
        } else if (start_date) {
            whereCondition.createdAt = {
                [Op.gte]: `${start_date} 00:00:00`
            };
        } else if (end_date) {
            whereCondition.createdAt = {
                [Op.lte]: `${end_date} 23:59:59`
            };
        }

        // 2. Filter Berdasarkan Kasir / User tertentu
        if (user_id) {
            whereCondition.user_id = user_id;
        }

        // Ambil data transaksi sesuai filter
        const transactions = await Transaction.findAll({
            where: whereCondition,
            include: [
                {
                    model: TransactionDetail,
                    as: 'details',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'product_name', 'purchase_price', 'selling_price']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Hitung Ringkasan / Rekapitulasi Keuangan
        let totalTransactions = transactions.length;
        let totalOmset = 0;
        let totalModal = 0;

        transactions.forEach(trx => {
            totalOmset += trx.total_price;
            
            // Hitung modal dari setiap item detail transaksi
            trx.details.forEach(detail => {
                const purchasePrice = detail.product ? detail.product.purchase_price : 0;
                totalModal += purchasePrice * detail.quantity;
            });
        });

        const totalProfit = totalOmset - totalModal; // Keuntungan Bersih

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil laporan keuangan",
            summary: {
                total_transactions: totalTransactions,
                total_omset: totalOmset,
                total_modal: totalModal,
                total_profit: totalProfit
            },
            data: transactions
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};