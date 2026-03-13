# Formulario IETS

Proyecto de formulario de registro con:

* **Frontend:** React
* **Backend:** ASP.NET Core Web API
* **Base de datos:** Firebase Firestore

El proyecto contiene dos carpetas principales.

```
Formulario-IETS
│
├── ApiFormulario       → Backend (.NET API)
└── formulario-salud    → Frontend (React)
```

La configuración de Firebase se encuentra en:

```
firebase-config.md
```

---

# Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

* Node.js
* .NET SDK
* npm

Verificar instalación:

```
node -v
npm -v
dotnet --version
```

---

# 1. Backend (.NET API)

Entrar a la carpeta del backend:

```
cd ApiFormulario
```

Ejecutar el servidor:

```
dotnet run
```

Si todo funciona correctamente aparecerá algo como:

```
Application started. Press Ctrl+C to shut down.
Hosting environment: Development
Content root path: ApiFormulario
```

La API quedará ejecutándose localmente.

---

# 2. Frontend (React)

Abrir otra terminal y entrar a la carpeta:

```
cd formulario-salud
```

Instalar dependencias:

```
npm install
```

Instalar Firebase:

```
npm install firebase
```

Ejecutar el proyecto:

```
npm start
```

Abrir en el navegador:

```
http://localhost:5173
```

---

# Configuración de Firebase

La configuración del archivo:

```
src/firebase/config.js
```

y la creación del proyecto en Firebase se explica en:

```
firebase-config.md
```

---

# Notas

Si aparece un mensaje sobre certificados HTTPS de ASP.NET Core se puede ejecutar:

```
dotnet dev-certs https --trust
```

Esto instala el certificado de desarrollo para ejecutar la API localmente.

---

# Ejecución completa

1. Ejecutar la API:

```
cd ApiFormulario
dotnet run
```

2. Ejecutar el frontend:

```
cd formulario-salud
npm install
npm run dev
```

3. Abrir en el navegador:

```
http://localhost:5173
```

---
