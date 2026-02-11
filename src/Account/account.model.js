
import { Schema, model } from "mongoose";

const accountSchema = Schema({
    accountNumber: {
        type: String,
        required: [true, "El número de cuenta es obligatorio"],
        unique: true,
        trim: true
    },
    accountType: {
        type: String,
        required: [true, "El tipo de cuenta es obligatorio"],
        enum: {
            values: ["AHORRO", "MONETARIA"],
            message: "Tipo de cuenta no válida"
        }
    },
    balance: {
        type: Number,
        default: 0,
        min: [0, "El saldo no puede ser negativo"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "El propietario de la cuenta es obligatorio"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índice para optimizar búsquedas por número de cuenta
accountSchema.index({ accountNumber: 1 });

export default model('Account', accountSchema);