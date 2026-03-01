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
router.get(
    '/my',
    validateJWT,
    getMyLoans
);

// Obtener préstamo por ID
router.get(
    '/:id',
    validateJWT,
    getLoanById
);

// Obtener todos los préstamos (ADMIN)
router.get(
    '/',
    validateJWT,
    isAdmin,
    getAllLoans
);

export default router;