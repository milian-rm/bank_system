'use strict';

import Debt from './debt.model';

// 1. OBTENER DEUDAS (Con Paginación y Filtros)
export const getDebts = async (req, res) => {
    try {
        const { page = 1, limit = 10, debtorId, status } = req.query;
        const filter = {};
        if (debtorId) filter.debtorId = debtorId;
        if (status) filter.status = status;

        const debts = await Debt.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ dueDate: 1 }); // Ordenar por las más próximas a vencer

        const total = await Debt.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: debts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. CREAR DEUDA
export const createDebt = async (req, res) => {
    try {
        const debt = new Debt(req.body);
        await debt.save();
        res.status(201).json({ success: true, message: 'Deuda registrada', data: debt });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 3. REGISTRAR UN PAGO A LA DEUDA
export const registerPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const debt = await Debt.findById(id);
        if (!debt) return res.status(404).json({ success: false, message: 'Deuda no encontrada' });

        if (debt.status === 'Pagado') {
            return res.status(400).json({ success: false, message: 'Esta deuda ya ha sido liquidada' });
        }

        // Actualizar monto restante
        debt.remainingAmount = Math.max(0, debt.remainingAmount - amount);

        // Actualizar estado basado en el saldo
        if (debt.remainingAmount === 0) {
            debt.status = 'Pagado';
        } else {
            debt.status = 'Parcial';
        }

        await debt.save();
        res.status(200).json({ success: true, message: 'Pago registrado con éxito', data: debt });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};