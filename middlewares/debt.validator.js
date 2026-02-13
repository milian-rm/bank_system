import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateDebt = [
    body('title')
        .trim()
        .notEmpty().withMessage('El título es requerido')
        .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

    body('debtorId')
        .notEmpty().withMessage('El ID del deudor es requerido')
        .isNumeric().withMessage('Debe ser un valor numérico'),

    body('creditorId')
        .notEmpty().withMessage('El ID del acreedor es requerido')
        .isNumeric().withMessage('Debe ser un valor numérico'),

    body('totalAmount')
        .notEmpty().withMessage('El monto total es requerido')
        .isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0'),

    body('dueDate')
        .notEmpty().withMessage('La fecha de vencimiento es requerida')
        .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)')
        .custom((value) => {
            if (new Date(value) < new Date().setHours(0,0,0,0)) {
                throw new Error('La fecha de vencimiento no puede ser anterior a hoy');
            }
            return true;
        }),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('La descripción no puede exceder los 255 caracteres'),

    checkValidators
];

export const validateDebtId = [
    param('id').isMongoId().withMessage('ID de deuda no válido'),
    checkValidators
];

export const validatePayment = [
    param('id').isMongoId().withMessage('ID de deuda no válido'),
    body('amount')
        .notEmpty().withMessage('El monto del pago es requerido')
        .isFloat({ min: 0.01 }).withMessage('El pago debe ser mayor a 0'),
    checkValidators
];