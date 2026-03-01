'use strict';

import { Router } from 'express';
import {
    getTransactions,
    createTransaction,
    getTransactionById,
    getAccountHistory
} from '../Transaction/transaction.controller.js';

import {
    validateCreateTransaction,
    validateTransactionId,
    validateHistoryId
} from '../../middlewares/transaction.validator.js';

const router = Router();

// Obtener historial
router.get('/', getTransactions);

// Obtener detalle de una transacción
router.get('/:id', validateTransactionId, getTransactionById);

// Crear nueva transacción
router.post(
    '/',
    validateCreateTransaction,
    createTransaction
);

router.get(
    '/account/:id/history', 
    validateHistoryId, 
    getAccountHistory
);

export default router;