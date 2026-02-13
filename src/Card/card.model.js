'use strict';

import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    cardNumber: { 
        type: String, 
        required: [true, 'El número de tarjeta es obligatorio'],
        unique: true,
        trim: true,
        // Validación simple de 16 dígitos
        match: [/^\d{16}$/, 'El número de tarjeta debe tener 16 dígitos']
    },
    holderName: {
        type: String,
        required: [true, 'El nombre del titular es obligatorio'],
        trim: true,
        uppercase: true
    },
    expirationDate: {
        type: String, // Formato MM/YY
        required: [true, 'La fecha de expiración es obligatoria'],
        trim: true
    },
    cvv: {
        type: String,
        required: [true, 'El CVV es obligatorio'],
        minLength: 3,
        maxLength: 4
    },
    type: {
        type: String,
        enum: ['DEBIT', 'CREDIT'],
        default: 'DEBIT'
    },
    brand: {
        type: String,
        enum: ['VISA', 'MASTERCARD', 'AMEX'],
        required: true
    },
    image: { 
        type: String,
        default: 'cards/default_card' 
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Card', cardSchema);