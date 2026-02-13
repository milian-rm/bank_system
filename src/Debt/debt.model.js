'use strict';

import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    debtorId: { // Quién debe el dinero
        type: Number,
        ref: 'User',
        required: true
    },
    creditorId: { // A quién se le debe
        type: Number,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0.01, 'El monto debe ser mayor a 0']
    },
    remainingAmount: { // Lo que falta por pagar
        type: Number,
        required: true,
        default: function() {
            return this.totalAmount;
        }
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Parcial', 'Pagado', 'Vencido'],
        default: 'Pendiente'
    },
    description: {
        type: String,
        maxlength: [255, 'La descripción es muy larga']
    }
}, { timestamps: true });

// Índice para buscar deudas rápidas por usuario y estado
debtSchema.index({ debtorId: 1, status: 1 });

export default mongoose.model('Debt', debtSchema);