import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateTransaction = [
    body('amount')
        .notEmpty().withMessage('El monto es requerido')
        .isFloat({ min: 0.01 }).withMessage('Monto inválido'),

    body('type')
        .notEmpty().withMessage('El tipo es requerido')
        .isIn([
            'DEPOSIT',
            'CARD_WITHDRAWAL',
            'SERVICE_PAYMENT',
            'LOAN_PAYMENT',
            'TRANSFER'
        ]).withMessage('Tipo de transacción no válido'),

    body('currency')
        .optional()
        .isIn(['GTQ', 'USD', 'EUR', 'MXN'])
        .withMessage('Moneda no válida'),

    body('exchangeRate')
        .optional()
        .isFloat({ min: 0.0001 })
        .withMessage('Tipo de cambio inválido'),

    checkValidators
];