import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateTransaction = [
    body('AccountOriginId')
        .notEmpty().withMessage('El ID de cuenta de origen es requerido')
        .isNumeric().withMessage('Debe ser un valor numérico'),

    body('AccountDestinyId')
        .notEmpty().withMessage('El ID de cuenta de destino es requerido')
        .isNumeric().withMessage('Debe ser un valor numérico')
        .custom((value, { req }) => {
            if (value === req.body.AccountOriginId) {
                throw new Error('La cuenta de destino no puede ser igual a la de origen');
            }
            return true;
        }),

    body('Amount')
        .notEmpty().withMessage('El monto es requerido')
        .isFloat({ min: 0.01 }).withMessage('El monto debe ser un número mayor a 0'),

    body('Type')
        .notEmpty().withMessage('El tipo de transacción es requerido')
        .isIn(['Transferencia', 'Deposito']).withMessage('Tipo no válido (Transferencia o Deposito)'),

    body('Description')
        .trim()
        .notEmpty().withMessage('La descripción es requerida')
        .isLength({ max: 255 }).withMessage('Máximo 255 caracteres'),

    checkValidators
];

export const validateTransactionId = [
    param('id').isMongoId().withMessage('ID de transacción no válido'),
    checkValidators
];