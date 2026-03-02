'use strict';

import { Router } from 'express';
import { validateJWT, isAdmin } from '../../middlewares/validate-jwt.js';

import {
    getMyLoans,
    getAllLoans,
    getLoanById
} from './loan.controller.js';

const router = Router();

// Obtener mis préstamos (cliente)
router.get('/',
    validateJWT,
    hasRole('ADMIN'),
    getLoans
);

router.get('/my-loans',
    validateJWT,
    hasRole('USER'),
    getMyLoans
);

router.post('/apply',
    validateJWT,
    hasRole('USER'),
    validateLoanApplication,
    createLoanApplication
);

router.put('/approve/:id',
    validateJWT,
    hasRole('ADMIN'),
    approveLoan
);

export default router;