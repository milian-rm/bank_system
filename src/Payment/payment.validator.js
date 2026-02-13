import { body } from 'express-validator';
import { validateErrors } from '../../middlewares/check-validators.js';

export const paymentValidator = [
    body('amount', 'Monto inválido').notEmpty().isNumeric(),
    body('description', 'Descripción muy corta').notEmpty().isLength({ min: 5 }),
    body('account', 'ID de cuenta inválido').notEmpty().isMongoId(),
    validateErrors
];