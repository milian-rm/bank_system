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

// Obtener el historial completo de una cuenta (entradas y salidas formateadas)
// Obtener el historial completo de una cuenta (entradas y salidas formateadas)
export const getAccountHistory = async (req, res) => {
    try {
        const { id } = req.params; // ID de la cuenta bancaria del usuario

        // 1. Buscamos todas las salidas (Usamos AccountOriginId)
        const salidas = await Transaction.find({ AccountOriginId: id })
            .populate('AccountOriginId', 'accountNumber bank')
            .populate('AccountDestinyId', 'accountNumber bank');

        // 2. Buscamos todas las entradas (Usamos AccountDestinyId)
        const entradas = await Transaction.find({ AccountDestinyId: id })
            .populate('AccountOriginId', 'accountNumber bank')
            .populate('AccountDestinyId', 'accountNumber bank');

        // 3. Juntamos todo y lo ordenamos por la fecha (Tu base de datos usa "Date")
        let historyRaw = [...salidas, ...entradas];
        historyRaw.sort((a, b) => new Date(b.Date) - new Date(a.Date));

        // 4. Mapeamos los datos para darles el formato visual
        const historialFormateado = historyRaw.map(tx => {
            // Verificamos si en esta transacción nuestra cuenta fue la que sacó el dinero
            const esSalida = tx.AccountOriginId && tx.AccountOriginId._id.toString() === id;
            
            const signo = esSalida ? '-' : '+';
            const tipoMovimiento = esSalida ? 'EGRESO' : 'INGRESO';

            // Usamos "Type" (con mayúscula)
            let descripcionMovimiento = tx.Type || 'Transacción'; 

            if (esSalida && tx.AccountDestinyId) {
                descripcionMovimiento = `${descripcionMovimiento} a cuenta ${tx.AccountDestinyId.accountNumber}`;
            } else if (!esSalida && tx.AccountOriginId) {
                descripcionMovimiento = `${descripcionMovimiento} de cuenta ${tx.AccountOriginId.accountNumber}`;
            }

            // Usamos "Amount" (con mayúscula)
            return {
                idTransaccion: tx._id,
                fecha: tx.Date,
                descripcion: descripcionMovimiento,
                montoDisplay: `${signo}Q${tx.Amount.toFixed(2)}`,
                montoReal: tx.Amount,
                tipo: tipoMovimiento,
                motivoOriginal: tx.Description // Le agregué la descripción que ponen en Postman para más contexto
            };
        });

        res.status(200).json({
            success: true,
            message: 'Historial de transacciones obtenido exitosamente',
            totalMovimientos: historialFormateado.length,
            data: historialFormateado
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener el historial de la cuenta', 
            error: error.message 
        });
    }
};