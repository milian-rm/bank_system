'use strict';

import { Router } from 'express';
import { 
    getDebts, 
    createDebt, 
    registerPayment 
} from '../Debt/debt.controller.js';

import { 
    validateCreateDebt, 
    validateDebtId, 
    validatePayment 
} from '../../middlewares/debt.validator.js';

const router = Router();

// Obtener todas las deudas (soporta ?debtorId=... y ?status=...)
router.get('/', getDebts);

// Crear una nueva deuda
router.post('/', validateCreateDebt, createDebt);

// Registrar un abono/pago a una deuda específica
router.patch('/:id/payment', validatePayment, registerPayment);

export default router;