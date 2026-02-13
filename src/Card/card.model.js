import Card from './card.model.js';
import { cloudinary } from '../../middlewares/file-uploaders.js';

// Obtener todas las tarjetas
export const getCards = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const filter = { isActive };

        const cards = await Card.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Card.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: cards,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las tarjetas', error: error.message });
    }
};

// Crear nueva tarjeta
export const createCard = async (req, res) => {
    try {
        const data = req.body;
        
        if (req.file) {
            const extension = req.file.path.split('.').pop();
            const relativePath = req.file.filename; 
            data.image = `${relativePath}.${extension}`;
        }

        const card = new Card(data);
        await card.save();

        res.status(201).json({ success: true, message: 'Tarjeta creada exitosamente', data: card });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear la tarjeta', error: error.message });
    }
};

// Actualizar tarjeta (por ejemplo, cambiar límites o diseño)
export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (req.file) {
            const currentCard = await Card.findById(id);
            if (currentCard?.image && !currentCard.image.includes('default_card')) {
                const imageName = currentCard.image.split('.')[0];
                try { await cloudinary.uploader.destroy(imageName); } catch (e) { console.log(e); }
            }
            const extension = req.file.path.split('.').pop();
            data.image = `${req.file.filename}.${extension}`;
        }
        
        const card = await Card.findByIdAndUpdate(id, data, { new: true });
        if (!card) return res.status(404).json({ success: false, message: 'Tarjeta no encontrada' });

        res.status(200).json({ success: true, data: card });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
};

// Activar/Desactivar tarjeta (Bloqueo bancario)
export const changeCardStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const isActive = req.url.includes('/activate');
        
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