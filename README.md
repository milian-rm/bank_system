# 🏦 Bank System - API de Gestión Bancaria

API RESTful para la gestión administrativa de cuentas bancarias, transacciones, tarjetas y control de deudas para la plataforma **Bank System**.

---

## 📝 Descripción

Servicio backend que proporciona endpoints para que los administradores gestionen usuarios, controlen saldos de cuentas, procesen transacciones financieras y administren tarjetas de crédito/débito.

Incluye un sistema de autenticación simplificado para validar accesos administrativos.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+ (ESM)  
- **Framework:** Express 4.x  
- **Base de Datos:** MongoDB 6.0+  
- **ODM:** Mongoose 8.x  
- **Validación:** express-validator  
- **Storage:** Cloudinary (imágenes de tarjetas)  
- **Seguridad:** Helmet, CORS, Rate Limiting  

---

## 🚀 Instalación

```bash
# Desde la raíz del proyecto
pnpm install

# Instalar dependencias específicas
pnpm install express mongoose dotenv cors morgan helmet express-validator cloudinary multer-storage-cloudinary
```

---

## ⚙️ Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
# Server
NODE_ENV=development
PORT=3001

# MongoDB
URI_MONGODB=mongodb://localhost:27017/bank_system

# Cloudinary (upload de imágenes de tarjetas)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=bank_system/cards
```

---

## 📂 Estructura del Proyecto

```
bank_system/
├── configs/            # Configuración principal (App, DB, CORS)
├── src/                # Código fuente de la API
│   ├── Auth/           # Registro y Login
│   ├── User/           # Gestión de Usuarios
│   ├── Account/        # Cuentas Bancarias
│   ├── Card/           # Tarjetas de Crédito/Débito
│   ├── Transaction/    # Historial de movimientos
│   └── Debt/           # Control de Deudas
├── middlewares/        # Validadores y manejadores de errores
└── index.js            # Punto de entrada de la aplicación
```

---

# 🔌 Endpoints Principales

## 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/bankSystem/v1/auth/register` | Registrar nuevo administrador |
| POST | `/bankSystem/v1/auth/login` | Iniciar sesión (Simple Auth) |

---

## 🏦 Cuentas Bancarias

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/bankSystem/v1/accounts` | Listar todas las cuentas |
| POST | `/bankSystem/v1/accounts` | Crear nueva cuenta bancaria |

---

## 💳 Tarjetas

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/bankSystem/v1/cards` | Crear tarjeta con imagen (Cloudinary) |
| PUT | `/bankSystem/v1/cards/:id/desactivate` | Bloquear tarjeta por seguridad |

---

# 📊 Ejemplo de Petición

## Crear Cuenta Bancaria

**POST**  
`http://localhost:3001/bankSystem/v1/accounts`

**Content-Type:** `application/json`

```json
{
  "accountNumber": "1020304050",
  "accountType": "AHORRO",
  "balance": 500.00,
  "user": "id-del-usuario-propietario"
}
```

---

# 🗄️ Modelos de Base de Datos (Esquemas)

---

## 👤 Usuario (User)

Representa a los clientes y administradores del banco.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|------------|
| UserName | String | ✅ | Nombre del usuario (Máx 100 caracteres) |
| UserSurname | String | ✅ | Apellido del usuario (Máx 100 caracteres) |
| UserDPI | String | ✅ | Documento Personal de Identificación (Único) |
| UserEmail | String | ✅ | Correo electrónico para acceso (Único) |
| UserPassword | String | ✅ | Contraseña en texto plano |
| UserRol | String | ✅ | ROL: ['ADMIN', 'USER'] |
| UserStatus | String | ❌ | Estado de la cuenta (Default: 'ACTIVE') |

---

## 💳 Cuenta Bancaria (Account)

Maneja los fondos y el tipo de cuenta vinculada a un usuario.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|------------|
| accountNumber | String | ✅ | Número de 10 dígitos (Único) |
| accountType | String | ✅ | Tipo: ['AHORRO', 'MONETARIA'] |
| balance | Number | ❌ | Saldo disponible (Mínimo: 0) |
| user | ObjectId | ✅ | Referencia al modelo User |
| status | Boolean | ❌ | true activa / false desactivada |

---

## 🪪 Tarjeta (Card)

Gestión de plásticos físicos o virtuales asociados a servicios.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|------------|
| cardNumber | String | ✅ | 16 dígitos únicos |
| holderName | String | ✅ | Nombre que aparece en la tarjeta |
| expirationDate | String | ✅ | Formato MM/YY |
| brand | String | ✅ | Marca: ['VISA', 'MASTERCARD', 'AMEX'] |
| type | String | ❌ | ['DEBIT', 'CREDIT'] |
| image | String | ❌ | URL de imagen gestionada en Cloudinary |

---

## 💸 Transacción (Transaction)

Registro histórico de movimientos financieros.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|------------|
| AccountOriginId | Number | ✅ | ID de la cuenta que envía |
| AccountDestinyId | Number | ✅ | ID de la cuenta que recibe |
| Amount | Number | ✅ | Monto de la operación (Mín: 0.01) |
| Type | String | ✅ | ['Transferencia', 'Deposito'] |
| Description | String | ✅ | Motivo del movimiento |

---

## 📉 Deuda (Debt)

Control de créditos y pagos pendientes.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|------------|
| title | String | ✅ | Nombre de la deuda o préstamo |
| debtorId | Number | ✅ | Referencia al usuario deudor |
| totalAmount | Number | ✅ | Monto total de la deuda |
| remainingAmount | Number | ❌ | Saldo pendiente por pagar |
| status | String | ❌ | ['Pendiente', 'Parcial', 'Pagado', 'Vencido'] |

---

# 🛠️ Scripts Disponibles

```bash
# Iniciar el servidor en modo desarrollo con nodemon
pnpm run dev

# Iniciar el servidor de forma normal
pnpm start
```


