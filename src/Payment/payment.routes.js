
import { Router } from 'express';
import { createPayment, getPayments } from './payment.controller.js';
import { validatePayment } from '../../middlewares/payment.validator.js';

const router = Router();

router.post('/',
    validateJWT,
    validatePayment,
    createPayment
);

router.get('/',
    validateJWT,
    hasRole('ADMIN'),
    getPayments
);

export default router;