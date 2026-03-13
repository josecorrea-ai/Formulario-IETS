# Formulario IETS

Proyecto de **formulario de registro de usuarios** desarrollado con:

* **Frontend:** React
* **Base de datos:** Firebase Firestore
* **Autenticación:** Firebase Auth

El sistema permite:

* Registrar usuarios mediante un formulario
* Guardar los datos en **Firebase Firestore**
* Visualizar los registros desde un **panel de administración**
* Administrar usuarios (editar, eliminar)

---

# Estructura del proyecto

```
formulario-salud
│
├── src
│   ├── components
│   │   ├── admin
│   │   │   └── AdminPanel.jsx
│   │   ├── Formulario.jsx
│   │   └── Login.jsx
│   │
│   ├── firebase
│   │   └── config.js
│   │
│   ├── styles
│   │
│   └── App.jsx
│
├── public
├── package.json
└── README.md
```

---

# Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

* Node.js
* npm

Verificar instalación:

```
node -v
npm -v
```

---

# Instalación del proyecto

1. Clonar el repositorio:

```
git clone https://github.com/TU-USUARIO/formulario-salud.git
```

2. Entrar a la carpeta del proyecto:

```
cd formulario-salud
```

3. Instalar dependencias:

```
npm install
```

---

# Ejecutar el proyecto

Iniciar el servidor de desarrollo:

```
npm run dev
```

Abrir en el navegador:

```
http://localhost:5173
```

---

# Configuración de Firebase

La configuración de Firebase se encuentra en:

```
src/firebase/config.js
```

Allí se inicializa Firebase y se conecta con:

* **Firebase Authentication**
* **Cloud Firestore**

Para usar el proyecto debes:

1. Crear un proyecto en **Firebase Console**
2. Copiar la configuración del proyecto
3. Pegarla en `config.js`

---

# Funcionalidades del sistema

El sistema incluye:

### Login

Permite iniciar sesión mediante Firebase Authentication.

### Formulario de registro

Permite registrar nuevos usuarios con:

* Nombre
* Apellido
* Tipo de documento
* Identificación
* Fecha de nacimiento
* Correo electrónico
* Documento PDF

Los datos se guardan en **Firestore**.

### Panel de administración

El administrador puede:

* Ver todos los usuarios registrados
* Editar registros
* Eliminar usuarios
* Visualizar documentos PDF
* Ver el contador de usuarios registrados

---

# Tecnologías utilizadas

* React
* Firebase
* Firestore
* React Router
* CSS

---

# Notas

* El proyecto utiliza **Firebase como backend**.
* Los datos se almacenan en **Cloud Firestore**.
* El sistema está pensado para ejecutarse como **aplicación web**.

---
