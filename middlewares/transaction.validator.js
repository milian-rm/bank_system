import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateTransaction = [
    body('AccountOriginId')
        .notEmpty().withMessage('El ID de cuenta de origen es requerido')
        .isMongoId().withMessage('Debe ser un ID válido de MongoDB'),

    body('AccountDestinyId')
        .notEmpty().withMessage('El ID de cuenta de destino es requerido')
        .isMongoId().withMessage('Debe ser un ID válido de MongoDB')
        .custom((value, { req }) => {
            if (value === req.body.AccountOriginId) {
                throw new Error('La cuenta de destino no puede ser igual a la de origen');
            }
            return true;
        }),

    body('Amount')
        .notEmpty().withMessage('El monto es requerido')
        .isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0.01'),

    body('Type')
        .notEmpty().withMessage('El tipo de transacción es requerido')
        .isIn(['Transferencia', 'Deposito']).withMessage('Tipo no válido'),

    body('Description')
        .notEmpty().withMessage('La descripción es requerida'),

    checkValidators
];

export const validateTransactionId = [
    param('id').isMongoId().withMessage('ID de transacción no válido'),
    checkValidators
];