import Transaction from './transaction.model.js';
import Account from '../Account/account.model.js';

// 1. Crear Transacción (Con lógica de descuento de saldo básica)
export const createTransaction = async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Validar que las cuentas existan
        const origin = await Account.findById(data.AccountOriginId);
        const destiny = await Account.findById(data.AccountDestinyId);

        if (!origin || !destiny) {
            return res.status(404).json({ success: false, message: 'Una de las cuentas no existe' });
        }

        // 2. Validar que las cuentas estén activas (¡Integración con el Soft-Delete!)
        if (!origin.status || !destiny.status) {
            return res.status(400).json({ success: false, message: 'Una de las cuentas está inactiva y no puede realizar transacciones' });
        }

        // 3. Verificar saldo de la cuenta de origen
        if (origin.balance < data.Amount) {
            return res.status(400).json({ success: false, message: 'Fondos insuficientes en la cuenta de origen' });
        }

        // 4. ¡La matemática bancaria! Actualizar los saldos
        origin.balance -= data.Amount;  // Le restamos al que envía
        destiny.balance += data.Amount; // Le sumamos al que recibe

        // Guardamos los cambios de los saldos en la base de datos
        await origin.save();
        await destiny.save();

        // 5. Crear el registro histórico de la transacción
        const transaction = new Transaction(data);
        await transaction.save();

        res.status(201).json({
            success: true,
            message: `Transacción de tipo ${data.Type} realizada con éxito`,
            data: {
                transaccion: transaction,
                nuevoSaldoOrigen: origin.balance,
                nuevoSaldoDestino: destiny.balance
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al procesar la transacción', error: error.message });
    }
};

// 2. Obtener historial (Con Populate)
export const getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, accountId } = req.query;
        
        // Si mandan accountId, filtramos donde sea origen O destino
        const filter = accountId ? { 
            $or: [{ AccountOriginId: accountId }, { AccountDestinyId: accountId }] 
        } : {};

        const transactions = await Transaction.find(filter)
            .populate('AccountOriginId', 'accountNumber') // Ver número de cuenta origen
            .populate('AccountDestinyId', 'accountNumber') // Ver número de cuenta destino
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ Date: -1 });

        const total = await Transaction.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener transacciones', error: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id)
            .populate('AccountOriginId', 'accountNumber')
            .populate('AccountDestinyId', 'accountNumber');

        if (!transaction) return res.status(404).json({ success: false, message: 'No encontrado' });

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};