import User from './user.model.js';


export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, UserStatus } = req.query;

    const filter = {};
    if (UserStatus) {
      filter.UserStatus = UserStatus;
    }

    const users = await User.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ UserCreatedAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedAdminId = req.user.uid;
        const data = req.body;

        const targetUser = await User.findById(id);
        if (!targetUser) return res.status(404).json({ message: 'Usuario no encontrado' });

        // REGLA: No puedes tocar a otro Admin si no eres tú mismo
        if (targetUser.UserRol === 'ADMIN' && loggedAdminId.toString() !== id) {
            return res.status(403).json({ message: 'No puedes editar a otro admin' });
        }

        // REGLA: Prohibido cambiar DPI o Password en el update común
        delete data.UserDPI;
        delete data.UserPassword;
        delete data.UserRol;

        const userUpdated = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({ 
            success: true, 
            message: 'Perfil actualizado (DPI y Password intactos)', 
            userUpdated 
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    user.UserStatus =
      user.UserStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    await user.save();

    res.status(200).json({
      success: true,
      message: `Usuario ${user.UserStatus === 'ACTIVE' ? 'activado' : 'desactivado'} exitosamente`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del usuario',
      error: error.message,
    });
  }
};

export const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ UserEmail: 'admin@kinal.edu.gt' });
        if (adminExists) return;

        // AQUÍ ESTÁ EL TRUCO: No uses bcrypt.hash aquí.
        const admin = new User({
            UserName: 'ADMINB',
            UserSurname: 'SYSTEM',
            UserDPI: '0000000000000',
            UserEmail: 'admin@kinal.edu.gt',
            UserPassword: 'ADMINB',
            UserRol: 'ADMIN',
            UserAddress: 'Ciudad',
            UserPhone: '00000000',
            UserJob: 'Admin',
            UserIncome: 0,
            UserStatus: 'ACTIVE',
            isVerified: true 
        });

        await admin.save();
        console.log('Admin ADMINB creado correctamente');
    } catch (err) {
        console.error('Error al crear admin:', err.message);
    }
};