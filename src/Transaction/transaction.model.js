'use strict';

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    AccountOriginId: {
        type: Number,
        required: true,
    },
    AccountDestinyId: {
        type: Number,
        required: true
    },
    Amount: {
        type: Number,
        required: true,
        min: [0.01, 'El monto debe ser mayor a 0']
    },
    Date: {
        type: Date,
        default: Date.now
    },
    Type: {
        type: String,
        required: true,
        enum: {
            values: ['Transferencia', 'Deposito'],
        }
    },
    Description: {
        type: String,
        required: true,
        maxLength: [255, 'La descripcion no puede ser mayor a 255 caracteres']
    }
});

transactionSchema.index({AccountOriginId: 1});

export default mongoose.model('Transaction', transactionSchema)