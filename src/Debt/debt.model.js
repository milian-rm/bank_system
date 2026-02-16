import { Schema, model } from 'mongoose';

const debtSchema = Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    debtorId: { // Quién debe
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creditorId: { // A quién se le debe
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0.01
    },
    remainingAmount: {
        type: Number,
        default: function() { return this.totalAmount; }
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
        type: String
    }
}, { timestamps: true });

export default model('Debt', debtSchema);