'use strict';

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxLength: [100, 'El nombre no puede tener más de 100 caracteres']
    },
    UserSurname: {
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true,
        maxLength: [100, 'El apellido no puede tener más de 100 caracteres']
    },
    UserDPI: {
        type: String,
        required: [true, 'El DPI es requerido'],
        trim: true,
        maxLength: [15, 'El DPI no puede tener más de 15 caracteres']
    },
    UserEmail: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: ['Correo electrónico no válido']
    },
    UserPassword: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minLength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    UserStatus: {
        type: String,
        trim: true,
        maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
        default: 'ACTIVO'
    },
    UserCreatedAt: {
        type: Date,
        default: Date.now
    },
    UserRol: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }
});

userSchema.index({ UserEmail: 1 });
userSchema.index({ UserDPI: 1 });

export default mongoose.model("User", userSchema);
