import Card from './card.model.js';
import Account from '../Account/account.model.js';
import { cloudinary } from '../../middlewares/file-uploader.js';

// Obtener todas las tarjetas (con datos de Cuenta y Usuario)
export const getCards = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const filter = { isActive };

        const cards = await Card.find(filter)
            .populate({
                path: 'account',
                select: 'accountNumber accountType balance user', // Datos de la cuenta
                populate: {
                    path: 'user',
                    select: 'UserName UserSurname UserEmail' // Datos del dueño
                }
            })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Card.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: cards,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las tarjetas', 
            error: error.message 
        });
    }
};

// Crear nueva tarjeta vinculada a una cuenta
export const createCard = async (req, res) => {
    try {
        const data = req.body;

        // 1. Validar que la cuenta exista
        const accountExist = await Account.findById(data.account);
        if (!accountExist) {
            // Si se subió imagen pero la cuenta falla, la borramos
            if (req.file && req.file.filename) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            return res.status(404).json({ 
                success: false, 
                message: 'La cuenta bancaria especificada no existe' 
            });
        }
        
        // -----------------------------------------------------
        // 2. Lógica de Imagen Flexible (Archivo vs Link)
        // -----------------------------------------------------
        if (req.file) {
            // OPCIÓN A: Subieron un archivo real -> Usamos la URL de Cloudinary
            data.image = req.file.path; 
        } else if (data.image) {
            // OPCIÓN B: Mandaron un link escrito (texto) -> Usamos ese link
            // Nota: data.image ya viene del req.body si lo mandaste como texto
            data.image = data.image; 
        }
        // OPCIÓN C: No mandaron nada -> El modelo pone 'cards/default_card' automáticamente
        // -----------------------------------------------------

        const card = new Card(data);
        await card.save();

        res.status(201).json({ 
            success: true, 
            message: 'Tarjeta creada exitosamente', 
            data: card 
        });
    } catch (error) {
        // Limpieza si falla algo
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(400).json({ 
            success: false, 
            message: 'Error al crear la tarjeta', 
            error: error.message 
        });
    }
};

// Actualizar tarjeta (Imagen o Datos)
export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const currentCard = await Card.findById(id);
        if (!currentCard) {
            return res.status(404).json({ success: false, message: 'Tarjeta no encontrada' });
        }

        // Si viene una nueva imagen, borramos la anterior de Cloudinary
        if (req.file) {
            if (currentCard.image && !currentCard.image.includes('default_card')) {
                // Extraemos el public_id de la URL antigua para borrarla
                // Nota: Esto asume que guardaste la URL completa. 
                // Si guardaste solo el filename, usa currentCard.image directamente.
                const nameArr = currentCard.image.split('/');
                const name = nameArr[nameArr.length - 1];
                const [publicId] = name.split('.');
                
                // Intentamos borrar usando el folder configurado
                // Ajusta 'bank_system/cards/' según tu carpeta en Cloudinary
                await cloudinary.uploader.destroy(`bank_system/cards/${publicId}`);
            }
            data.image = req.file.path;
        }
        
        const card = await Card.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({ success: true, message: 'Tarjeta actualizada', data: card });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
};

// Activar/Desactivar tarjeta
export const changeCardStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Detecta si la URL termina en 'activate' o 'desactivate'
        const isActive = req.path.includes('activate') && !req.path.includes('desactivate');
        
        const card = await Card.findByIdAndUpdate(id, { isActive }, { new: true });
        
        if (!card) return res.status(404).json({ success: false, message: 'Tarjeta no encontrada' });

        res.status(200).json({
            success: true,
            message: `Tarjeta ${isActive ? 'activada' : 'bloqueada'} correctamente`,
            data: card
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};