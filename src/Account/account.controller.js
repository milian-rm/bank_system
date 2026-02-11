
import Account from "./account.model.js";

// Crear nueva cuenta
export const createAccount = async (req, res) => {
    try {
        const data = req.body;
        
        const account = new Account(data);
        await account.save();

        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la cuenta',
            error: error.message
        });
    }
};

// Obtener todas las cuentas (activas)
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ status: true }).populate('user', 'name surname email');
        res.status(200).json({
            success: true,
            total: accounts.length,
            accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las cuentas',
            error: error.message
        });
    }
};