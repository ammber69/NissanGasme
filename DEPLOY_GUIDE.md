# Guía de Despliegue en Servidor Ubuntu

Esta guía explica cómo desplegar la aplicación "Gasme" en tu servidor Linux Ubuntu, conectándola a la base de datos PostgreSQL local del servidor.

## Requisitos Previos en el Servidor
Asegúrate de tener instalados `git`, `docker` y `docker-compose`.
```bash
# Actualizar repositorios
sudo apt update

# Instalar Docker
sudo apt install -y docker.io docker-compose

# Iniciar y habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Añadir tu usuario al grupo docker (para no usar sudo en cada comando docker)
sudo usermod -aG docker $USER
# (Cierra sesión y vuelve a entrar para aplicar cambios)
```

## Pasos para Desplegar

### 1. Clonar el repositorio
Entra al servidor y clona tu proyecto (o haz `git pull` si ya lo tienes):
```bash
cd /ruta/donde/quieras/el/proyecto
git clone <URL_DE_TU_REPO> gasme-app
cd gasme-app
```

### 2. Configurar Variables de Entorno
El archivo `docker-compose.yml` ya tiene configuración por defecto para conectar a la base de datos del host (`host.docker.internal`).
Sin embargo, **debes cambiar la contraseña de la base de datos**.

Edita `docker-compose.yml`:
```bash
nano docker-compose.yml
```
Busca la línea `DB_PASSWORD=password` y cámbiala por tu contraseña real de PostgreSQL.

### 3. Asegurar acceso a la Base de Datos
Para que el contenedor pueda conectar a Postgres en el host, necesitas asegurarte de que Postgres escuche en todas las interfaces (o al menos en la de Docker) y permita la conexión.

1.  Edita `postgresql.conf` (la ruta varía por versión, ej: `/etc/postgresql/14/main/postgresql.conf`):
    ```ini
    listen_addresses = '*'
    ```

2.  Edita `pg_hba.conf` (`/etc/postgresql/14/main/pg_hba.conf`):
    Añade esta línea al final para permitir conexiones desde la red de Docker (típicamente 172.17.0.0/16):
    ```
    host    all             all             172.17.0.0/16            scram-sha-256
    ```
    *Nota: Si tienes dudas, puedes usar `0.0.0.0/0` temporalmente para probar, pero es menos seguro.*

3.  Reinicia Postgres:
    ```bash
    sudo systemctl restart postgresql
    ```

### 4. Construir y Levantar Contenedores
```bash
docker-compose up -d --build
```
- `-d`: Corre en segundo plano.
- `--build`: Re-construye las imágenes.

### 5. Verificar
Accede a la IP de tu servidor en el navegador: `http://TU_IP_SERVIDOR`.
El frontend debería cargar y conectarse al backend.

### Solución de Problemas
- **Logs Backend**: `docker logs -f gasme_backend`
- **Logs Frontend/Nginx**: `docker logs -f gasme_frontend`
- **Reiniciar todo**: `docker-compose down && docker-compose up -d`
