'use strict';

import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';

import {
    createTransaction,
    getTransactions
} from './transaction.controller.js';

import {
    validateCreateTransaction
} from '../../middlewares/transaction.validator.js';

const router = Router();

// Crear transacción
router.post(
    '/',
    validateJWT,
    validateCreateTransaction,
    createTransaction
);

// Listar transacciones del usuario
router.get(
    '/',
    validateJWT,
    getTransactions
);

export default router;