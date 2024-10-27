# 📝 EasyNotes

## Descripción del Proyecto

La **Aplicación de Notas** es una plataforma web diseñada para facilitar la gestión de notas personales de los usuarios, permitiéndoles crear, editar, visualizar y eliminar sus notas de manera organizada y accesible. Entre sus funcionalidades, se encuentran la búsqueda de notas 🔍, la autenticación de usuarios 🔑 y el historial de cambios 📜, todo ello orientado a proporcionar un entorno seguro y privado para el almacenamiento de información personal.

Esta aplicación está en fase de desarrollo y es producto de la colaboración de dos personas:
- **Frontend:** Kenneth Santiago Ceballos Sierra: Implementación de la interfaz de usuario y la lógica del cliente.
- **Backend:** Juan David Rivero Romero: Desarrollo de la API y la gestión de autenticación mediante JWT.

> **Estado actual:** El proyecto aún está en construcción y cuenta con una arquitectura básica de frontend y backend. En la versión actual, la gestión de notas se realiza a través de Local Storage, y se está trabajando en la integración de una API que permita la autenticación y el almacenamiento de datos en una base de datos remota.

## ⚠️ Problemática

En un entorno digital, muchos usuarios necesitan una forma eficiente y segura para gestionar sus pensamientos y tareas. Las aplicaciones de notas convencionales pueden carecer de características clave, como autenticación segura 🔒, historial de cambios y opciones de búsqueda efectivas, lo cual puede llevar a pérdida de datos o falta de organización.

### Problemas específicos que aborda la **Aplicación de Notas**:

1. **Falta de Organización:** Facilita la categorización y búsqueda rápida de notas.
2. **Seguridad de la Información:** Implementa autenticación para proteger el acceso.
3. **Historial de Cambios:** Permite ver y restaurar versiones anteriores de las notas.
4. **Accesibilidad:** Diseño intuitivo para usuarios de distintos niveles de experiencia.

## ✨ Características

### Funcionalidades Principales

- **Crear Nota:** 🆕 Agregar una nueva nota con título y contenido.
- **Editar Nota:** ✏️ Modificar el título y contenido de una nota existente.
- **Eliminar Nota:** 🗑️ Eliminar una nota específica.
- **Ver Notas:** 📃 Listar todas las notas con detalles individuales.
- **Buscar Notas:** 🔍 Búsqueda de notas por título o contenido, filtrando en tiempo real.

### Funcionalidades Adicionales en Progreso

- **Autenticación de Usuario:** 🔐 Creación de cuentas e inicio de sesión mediante JWT.
- **Historial de Cambios:** 🔄 Seguimiento de ediciones y eliminaciones en la base de datos.
- **Filtrado Avanzado:** 🏷️ Búsqueda y filtros por etiquetas y categorías (en desarrollo).

## 🗂️ Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

```plaintext
├── assets
│   ├── css
│   │   ├── styleEN.css
│   │   ├── styles.css
│   │   └── variable.css
│   ├── font
│   ├── img
│   └── js
│       ├── screen.js
│       ├── script.js
│       ├── scriptLogin.js
│       └── signup.js
├── view
│   ├── index.html
│   ├── signup.html
├── README.md
└── index.html
```

### Descripción de los Archivos

- 🎨 **assets/css/**: Contiene los archivos de estilos para la aplicación.
  - `styleEN.css`, `styles.css`, `variable.css`: Archivos de estilos que definen la apariencia y el diseño.
- 💻 **assets/js/**: Incluye los scripts que gestionan la funcionalidad de la aplicación.
  - `screen.js`: Controla la lógica de la interfaz de usuario.
  - `script.js`, `scriptLogin.js`, `signup.js`: Gestionan el flujo de la autenticación y el manejo de notas.
- 📄 **view/**: Archivos HTML que definen la estructura de las páginas.
  - `index.html`, `signup.html`: Páginas principales de la aplicación.
- 📚 **README.md**: Archivo que contiene la documentación del proyecto.

## 🚀 Instalación y Uso 

### Prerrequisitos

Para ejecutar este proyecto en local, asegúrate de tener instalado Visual Studio Code.

### Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/iKitzu/EasyNotes.git
   cd aplicacion-notas
   ```
   
2. **Abre `index.html` en tu navegador** para visualizar la aplicación.

3.  **Disfruta** 😄

### Uso

1. 📝 **Registro e Inicio de Sesión:** Crea una cuenta y accede a la plataforma.
2. 🗒️ **Gestión de Notas:** Crea, edita, visualiza y elimina notas desde la interfaz principal.
3. 🔍 **Buscar Notas:** Utiliza la barra de búsqueda para filtrar tus notas en tiempo real.

## ⚙️ Funcionamiento de la Aplicación

Actualmente, la gestión de notas se realiza a través de **Local Storage**, lo que permite almacenar las notas en el navegador del usuario. Las funcionalidades de autenticación y el uso de una API para almacenar y recuperar notas desde una base de datos están en desarrollo, con miras a mejorar la seguridad y disponibilidad de los datos.

### Estado de la Autenticación

La autenticación de usuario y la seguridad de la información se gestionarán mediante **JSON Web Tokens (JWT)**, asegurando que solo los usuarios autenticados puedan acceder a sus notas.

## 📅 Estado del Proyecto

El proyecto está en fase de desarrollo. Las siguientes mejoras están pendientes:

- **Consumo de API** para la gestión de notas con una base de datos en lugar de Local Storage.
- **Mejoras en la Interfaz de Usuario** para una experiencia de usuario más fluida y atractiva.
- **Implementación del Historial de Cambios** para poder restaurar versiones anteriores de las notas.
- **Optimización de Seguridad** mediante autenticación avanzada y encriptación de datos sensibles.

## 🤝 Contribución

Este proyecto fue desarrollado por dos colaboradores:
- **Responsable del Frontend:** Kenneth Santiago Ceballos Sierra: Desarrollo de la interfaz y funcionalidad de usuario.
- **Responsable del Backend:** Juan David Rivero Romero: Implementación de la API y configuración de la autenticación JWT.
