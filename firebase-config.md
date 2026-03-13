# Configuración de Firebase

El proyecto utiliza Firebase Firestore como base de datos.

## 1. Crear proyecto en Firebase

Ir a:

https://console.firebase.google.com/

Crear un nuevo proyecto.

## 2. Crear aplicación web

Dentro del proyecto seleccionar:

```
Agregar aplicación → Web
```

Firebase generará un objeto de configuración.

## 3. Crear archivo de configuración

Crear el archivo:

```
src/firebase/config.js
```

## 4. Agregar la configuración

```
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwRLxH5v0I8DNjbVBjsDBY644tNKcLGY8",
  authDomain: "formulario-iets.firebaseapp.com",
  projectId: "formulario-iets",
  storageBucket: "formulario-iets.firebasestorage.app",
  messagingSenderId: "204018982145",
  appId: "1:204018982145:web:f613d0bc160daa49598f00",
  measurementId: "G-04FGK2VS1D"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
```

## 5. Usar Firestore en el proyecto

Importar la conexión:

```
import { db } from "../firebase/config";
```

Con esto el proyecto queda conectado a Firebase.
