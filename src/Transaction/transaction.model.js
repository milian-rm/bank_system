import { Schema, model } from 'mongoose';

const transactionSchema = Schema({
    AccountOriginId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    AccountDestinyId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
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
        enum: ['Transferencia', 'Deposito']
    },
    Description: {
        type: String,
        required: true,
        maxLength: [255, 'La descripción no puede ser mayor a 255 caracteres']
    }
}, {
    versionKey: false
});

export default model('Transaction', transactionSchema);