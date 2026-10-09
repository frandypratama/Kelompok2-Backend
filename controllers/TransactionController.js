import { Transaction, TransactionDetail } from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import db from "../config/Database.js";

// Proses Transaksi Kasir (Checkout)
export const createTransaction = async (req, res) => {
    const t = await db.transaction(); // Menggunakan transaksi database agar aman (atomic)
    try {
        const { payment, items, user_id } = req.body; 
        // items format: [{ product_id: 1, quantity: 2 }, ...]

        if (!items || items.length === 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Keranjang kasir kosong!" });
        }

        let total_price = 0;
        const detailsData = [];

        // 1. Validasi stok dan hitung total harga
        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction: t });

            if (!product) {
                await t.rollback();
                return res.status(404).json({ success: false, message: `Produk ID ${item.product_id} tidak ditemukan` });
            }

            if (product.stock < item.quantity) {
                await t.rollback();
                return res.status(400).json({ 
                    success: false, 
                    message: `Stok produk '${product.product_name}' tidak cukup. Sisa stok: ${product.stock}` 
                });
            }

            const subtotal = product.selling_price * item.quantity;
            total_price += subtotal;

            // Kurangi stok produk secara otomatis
            product.stock -= item.quantity;
            await product.save({ transaction: t });

            detailsData.push({
                product_id: product.id,
                selling_price: product.selling_price,
                quantity: item.quantity,
                subtotal: subtotal
            });
        }

        // 2. Validasi pembayaran kasir
        if (payment < total_price) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Uang pembayaran kurang dari total belanja!" });
        }

        // 3. Buat nomor invoice otomatis (Contoh: INV-TIMESTAMP)
        const invoice_no = `INV-${Date.now()}`;

        // 4. Simpan ke tabel utama transactions
        const newTransaction = await Transaction.create({
            invoice_no,
            total_price,
            payment,
            user_id: user_id || null
        }, { transaction: t });

        // 5. Simpan detail item ke tabel transaction_details
        for (const detail of detailsData) {
            detail.transaction_id = newTransaction.id;
            await TransactionDetail.create(detail, { transaction: t });
        }

        await t.commit(); // Eksekusi permanen ke database

        const change = payment - total_price; // Hitung kembalian

        res.status(201).json({
            success: true,
            message: "Transaksi kasir berhasil!",
            data: {
                transaction_id: newTransaction.id,
                invoice_no,
                total_price,
                payment,
                change, // Kembalian
            }
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

// Ambil Riwayat Transaksi Kasir
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                {
                    model: TransactionDetail,
                    as: 'details',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['product_name']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil riwayat transaksi",
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Ambil Detail Transaksi Berdasarkan ID
export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id, {
            include: [
                {
                    model: TransactionDetail,
                    as: 'details',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'product_name', 'selling_price']
                        }
                    ]
                }
            ]
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
        }

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail transaksi",
            data: transaction
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};