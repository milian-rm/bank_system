'use strict';

import { Router } from 'express';

// IMPORTACIÓN CORREGIDA
import { validateJWT, hasRole } from '../../middlewares/validate-jwt.js';

import {
    getMyLoans,
    getAllLoans,
    getLoanById
} from './loan.controller.js';

const router = Router();

router.get('/',
    validateJWT,
    hasRole('ADMIN'),
    getAllLoans 
);

router.get('/my-loans',
    validateJWT,
    hasRole('USER'),
    getMyLoans
);

router.get('/:id',
    validateJWT,
    getLoanById
);

export default router;