'use strict';

import Transaction from './transaction.model.js';

// 1. obtener transacciones
export const getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, accountId } = req.query;
        
        // Filtro opcional por cuenta
        const filter = accountId ? { 
            $or: [{ AccountOriginId: accountId }, { AccountDestinyId: accountId }] 
        } : {};

        const transactions = await Transaction.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ Date: -1 }); // Las más recientes primero

        const total = await Transaction.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener transacciones',
            error: error.message
        });
    }
};

// 2. crear transaccion
export const createTransaction = async (req, res) => {
    try {
        const data = req.body;
        const transaction = new Transaction(data);
        await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transacción registrada con éxito',
            data: transaction
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al procesar la transacción',
            error: error.message
        });
    }
};

// 3. obtener por id
export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};