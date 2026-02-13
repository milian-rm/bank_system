import { Schema, model } from 'mongoose';

const paymentSchema = Schema({
    amount: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [1, 'El monto mínimo es 1']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    date: {
        type: Date,
        default: Date.now
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'La cuenta de origen es obligatoria']
    }
}, { versionKey: false });

export default model('Payment', paymentSchema);