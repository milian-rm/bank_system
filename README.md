# 🏦 Sistema de Gestión Bancaria (Core Bank API)

Un sistema integral para la administración de operaciones financieras, gestión de cuentas multimoneda, préstamos y procesamiento seguro de transacciones. Diseñado bajo una arquitectura escalable y segura con Node.js y MongoDB.

## 📋 Tabla de Contenidos
- [✨ Características](#-características)
- [⚙️ Requisitos Previos](#️-requisitos-previos)
- [📥 Instalación](#-instalación)
- [🏗️ Estructura del Proyecto](#️-estructura-del-proyecto)
- [🔌 API Endpoints](#-api-endpoints)
  - [Usuarios](#1-gestión-de-usuarios)
  - [Cuentas](#2-cuentas-accounts)
  - [Tarjetas](#3-tarjetas-cards)
  - [Transacciones](#4-transacciones-transactions)
  - [Préstamos](#5-préstamos-y-solicitudes)
  - [Servicios Adicionales](#6-divisas-y-favoritos)
- [🔐 Seguridad](#-seguridad)
- [📄 Licencia](#-licencia)

---

## ✨ Características
- 💳 **Gestión de Cuentas y Tarjetas**: Control total sobre cuentas bancarias y plásticos con soporte para carga de imágenes personalizadas.
- 💸 **Transacciones Atómicas**: Transferencias y depósitos seguros con capacidad de reversión administrativa.
- 🏦 **Workflow de Préstamos**: Gestión del ciclo de vida de créditos, desde la solicitud del cliente hasta la aprobación del administrador.
- 💱 **Conversión de Divisas**: Integración de tipo de cambio en tiempo real para operaciones internacionales.
- 👥 **RBAC (Role Based Access Control)**: Sistema de permisos granulares para Clientes y Administradores.
- ⭐ **Agenda de Favoritos**: Gestión de contactos frecuentes para agilizar movimientos bancarios.

---

## ⚙️ Requisitos Previos
- **Node.js**: v18.0 o superior (LTS recomendada)
- **MongoDB**: v6.0 o superior
- **Gestor de paquetes**: npm o yarn

---

## 📥 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [https://github.com/milian-rm/bank_system.git](https://github.com/milian-rm/bank_system.git)
   cd bank_system
2. Instalar dependencias
  npm install

3. configurar el entorno
  PORT=3001
   
  # MongoDB
  URI_MONGODB=mongodb://localhost:27017/bank_system
   
   
  # Configuración JWT
  SECRET_KEY=EstaEsMiLlaveSecretaParaElRestaurante2026
  # Configuración Email (Nodemailer)
  EMAIL_USER=systembank9@gmail.com
  EMAIL_PASS=lvev opou rqul bvua

4. iniciar el servidor
  node index.js

## 🏗️ Estructura del Proyecto

bank_system/
├── src/
│   ├── api/
│   │   ├── controllers/    # Controladores de la lógica de negocio
│   │   ├── routes/         # Definición de rutas y endpoints
│   │   └── middlewares/    # Validadores de JWT, Roles y Multer
│   ├── models/             # Esquemas de datos (Mongoose)
│   ├── services/           # Lógica compleja y servicios externos
│   └── utils/              # Helpers y utilidades financieras
├── public/                 # Archivos estáticos e imágenes subidas
└── tests/                  # Pruebas de integración y unitarias

## 🔌 API Endpoints
### 🔐 Autenticación
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |

### 👤 Gestión de Usuarios
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/users` | Registrar un nuevo usuario (Solo ADMIN) |
| GET | `/api/users` | Listar todos los usuarios del sistema (Solo ADMIN) |
| GET | `/api/users/:id` | Obtener perfil detallado de un usuario |
| PUT | `/api/users/:id` | Actualizar información de perfil personal |
| PUT | `/api/users/:id/status` | Activar o desactivar cuenta de usuario (Solo ADMIN) |

### 💰 Cuentas Bancarias
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/accounts` | Crear una nueva cuenta bancaria (Solo ADMIN) |
| GET | `/api/accounts` | Listar cuentas del usuario autenticado |
| PUT | `/api/accounts/:id/status` | Cambiar estado de cuenta activa/inactiva (Solo ADMIN) |
| GET | `/api/accounts/movements/ranking` | Ver ranking de cuentas con más movimientos (Solo ADMIN) |
| GET | `/api/accounts/:id/details` | Detalles de cuenta y Top 5 movimientos (Solo ADMIN) |

### 💳 Tarjetas
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/cards` | Solicitar tarjeta con carga de imagen personalizada |
| GET | `/api/cards` | Ver catálogo completo de tarjetas (Solo ADMIN) |
| PUT | `/api/cards/:id` | Actualizar datos o imagen de la tarjeta |
| PUT | `/api/cards/:id/status` | Activar o desactivar tarjeta (Solo ADMIN) |
| PUT | `/api/cards/:id/approve` | Aprobar tarjeta de crédito pendiente (Solo ADMIN) |

### 💸 Transacciones
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/transactions` | Realizar un nuevo depósito o transferencia |
| GET | `/api/transactions` | Listar historial general de transacciones |
| GET | `/api/transactions/account/:id/history` | Ver historial de movimientos de una cuenta específica |
| PUT | `/api/transactions/revert/:id` | Revertir un depósito realizado por error (Solo ADMIN) |

### 📝 Solicitudes de Préstamo
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/loan-applications` | Crear una nueva solicitud de préstamo |
| PUT | `/api/loan-applications/:id` | Editar datos de una solicitud pendiente |
| PUT | `/api/loan-applications/:id/cancel` | Cancelar una solicitud de préstamo |
| PUT | `/api/loan-applications/:id/approve` | Aprobar solicitud y generar préstamo activo (Solo ADMIN) |
| PUT | `/api/loan-applications/:id/reject` | Rechazar solicitud de préstamo (Solo ADMIN) |
| GET | `/api/loan-applications` | Listar todas las solicitudes del sistema (Solo ADMIN) |

### 🏦 Préstamos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/api/loans` | Listar todos los préstamos del banco (Solo ADMIN) |
| GET | `/api/loans/my-loans` | Ver préstamos activos del usuario logueado |
| GET | `/api/loans/:id` | Obtener detalles de un préstamo específico |

### 💱 Divisas y Favoritos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| POST | `/api/exchange/convert` | Calcular conversión entre distintas divisas |
| POST | `/api/favorites` | Agregar una cuenta a la lista de favoritos |
| GET | `/api/favorites/my-favorites` | Listar contactos favoritos del usuario |
| DELETE | `/api/favorites/:id` | Eliminar una cuenta de la lista de favoritos |

### 📦 Productos Bancarios
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/api/products` | Listar catálogo de productos y servicios |
| POST | `/api/products` | Crear nuevo producto bancario (Solo ADMIN) |
| PUT | `/api/products/:id` | Actualizar producto existente (Solo ADMIN) |
| DELETE | `/api/products/:id` | Eliminar un producto del catálogo (Solo ADMIN) |

## 👨‍💻 Autor

**Roberto Antonio Milián Reyna** - [@milian-rm](https://github.com/milian-rm)

## 🙏 Agradecimientos

- Agradecemos a todos los contribuidores
- Inspiración en mejores prácticas de desarrollo

## 📞 Contacto

Para preguntas o soporte:
- Email: systembank9@gmail.com
- Issues: [GitHub Issues](https://github.com/milian-rm/bank_system/issues)
