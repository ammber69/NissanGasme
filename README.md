# Portal de Empleo "Gasme Automotriz" 🚗

![Logo de Gasme](public/logo-sucursal.png)

Este es un portal de empleo moderno y funcional construido con **React** para el frontend y **Node.js/Express** para el backend, diseñado para que "Gasme Automotriz" (un concesionario de Nissan) pueda publicar sus vacantes y gestionar las solicitudes de los candidatos de manera eficiente.

## ✨ Características Principales

-   **Búsqueda y Visualización de Vacantes:** Interfaz principal con tarjetas de empleo claras y atractivas.
-   **Filtrado Dinámico:** Filtra las vacantes por palabra clave y **agencia/sucursal** sincronizada directamente desde la base de datos.
-   **Detalle de la Vacante:** Panel modal con descripción detallada del puesto, requisitos y beneficios del concesionario.
-   **Proceso de Aplicación Completo:** Formulario para que los candidatos ingresen sus datos y adjunten su CV.
-   **Confirmación por Correo:** Envío automático de correos electrónicos de confirmación tras cada postulación exitosa utilizando **SMTP (Nodemailer)**.
-   **Almacenamiento Dual de CV:** Respaldo de archivos CV tanto en el servidor local como en formato **BLOB** directamente en la base de datos PostgreSQL para mayor seguridad.
-   **Seguimiento de Postulación:** Funcionalidad para que los candidatos rastreen el estado de su solicitud con un código único generado automáticamente.
-   **Diseño Responsivo:** Interfaz optimizada para una experiencia perfecta en dispositivos de escritorio y móviles.

## 🚀 Tecnologías Utilizadas

### Frontend
-   **Framework:** ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
-   **Herramienta de Build:** ![Vite](https://img.shields.io/badge/Vite-black?style=for-the-badge&logo=vite)
-   **Librería de Iconos:** `lucide-react`
-   **Estilos:** CSS puro (objetos de estilo en componentes)

### Backend
-   **Servidor:** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
-   **Base de Datos:** ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
-   **Notificaciones:** ![Nodemailer](https://img.shields.io/badge/Nodemailer-007ACC?style=for-the-badge) (SMTP Service)
-   **Gestión de Archivos:** `Multer` para la subida de CVs.

## 🛠️ Instalación y Configuración

El proyecto ahora soporta una orquestación completa mediante Docker, incluyendo la base de datos PostgreSQL autoconfigurada.

### 🐳 Opción A: Ejecución con Docker (Recomendado)
Asegúrate de tener instalado **Docker** y **Docker Compose**.

1.  **Levantar todos los servicios:**
    ```bash
    docker compose up -d --build
    ```
    *Esto levantará el Frontend (puerto 80), Backend (puerto 3002) y la Base de Datos (puerto 5432) con datos de prueba iniciales.*

2.  **Acceso:**
    - Frontend: `http://localhost`
    - Backend Health Check: `http://localhost:3002/api/health`

### 💻 Opción B: Ejecución Local (Desarrollo)

#### 1. Configuración del Backend
1.  Navega a la carpeta del servidor e instala dependencias:
    ```bash
    cd server && npm install
    ```
2.  Configura las variables de entorno:
    Copia el archivo `.env.example` a `.env` y completa tus credenciales.
3.  Inicializa la base de datos (requiere PostgreSQL local):
    ```bash
    node init-db.js
    node seed-db.js
    ```
4.  Inicia el servidor:
    ```bash
    npm run dev
    ```

#### 2. Configuración del Frontend
1.  En la raíz del proyecto, instala dependencias:
    ```bash
    npm install
    ```
2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    - Acceso: `http://localhost:5173`

## 🖼️ Vistas de la Aplicación

| Vista de Escritorio                                | Vista Móvil                               |
| -------------------------------------------------- | ----------------------------------------- |
| ![Vista de Escritorio](public/VistaPC.png)             | ![Vista Móvil](public/VistaMobile.png)             |

---

Desarrollado con ❤️ para la gestión de talento en Gasme Automotriz.
