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
router.post('/transfer',
    validateJWT,
    hasRole('USER'),
    validateTransfer,
    transfer
);

router.post('/deposit',
    validateJWT,
    hasRole('ADMIN'),
    validateDeposit,
    deposit
);

router.put('/revert/:id',
    validateJWT,
    hasRole('ADMIN'),
    revertDeposit
)

router.get(
    '/account/:id/history', 
    validateHistoryId, 
    getAccountHistory

);


export default router;