'use strict';

import { Router } from 'express';

import {
    getTransactions,
    createTransaction,
    getAccountHistory,
    revertDeposit
} from '../Transaction/transaction.controller.js';

import {
    validateJWT
} from '../../middlewares/validate-jwt.js';


import {
    validateCreateTransaction,
    validateHistoryId
} from '../../middlewares/transaction.validator.js';

const router = Router();

// Crear transacción
router.post(
    '/',
    validateJWT,
    validateCreateTransaction,
    createTransaction
);

router.get(
    '/account/:id/history', 
    validateHistoryId, 
    getAccountHistory

);
// Listar transacciones del usuario
router.get(
    '/',
    validateJWT,
    getTransactions
);

// Revertir depósito (1 minuto)
router.put(
    '/:id/revert',
    validateJWT,
    revertDeposit
);

export default router;