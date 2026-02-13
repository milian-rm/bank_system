'use strict';

import { Router } from 'express';
import {
    getTransactions,
    createTransaction,
    getTransactionById
} from '../Transaction/transaction.controller.js';

import {
    validateCreateTransaction,
    validateTransactionId
} from '../../middlewares/transaction-validators.js';

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

export default router;