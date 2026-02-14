# POMODORO-SIMPLE

Una aplicación sencilla y sólida en Node.js que permite registrar sesiones Pomodoro, ver estadísticas diarias y generar un reporte diario automático.

## Requisitos

- Node.js (Versión LTS recomendada, ej. v18+ o v20+)
- npm

## Instalación

1.  Clonar el repositorio o descargar el código.
2.  Instalar dependencias:

    ```bash
    npm install
    ```

## Ejecución

### Desarrollo

Para correr en modo desarrollo con recarga automática (`nodemon`):

```bash
npm run dev
```

### Producción

Para correr en modo producción:

```bash
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Uso de la API

### Sesiones

**Crear una sesión:**

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"label": "Estudio", "workMinutes": 25, "breakMinutes": 5, "notes": "Repaso de Node.js"}'
```

**Listar sesiones (por fecha):**

```bash
curl "http://localhost:3000/api/sessions?date=2023-10-27"
```

**Obtener estadísticas (por fecha):**

```bash
curl "http://localhost:3000/api/stats?date=2023-10-27"
```

### Reportes

**Generar reporte manual:**

```bash
curl -X POST "http://localhost:3000/api/reports/generate?date=2023-10-27"
```

**Obtener reporte del día:**

```bash
curl http://localhost:3000/api/reports/today
```

## Estructura del Proyecto

```
pomodoro-simple/
├── src/
│   ├── db/             # Capa de base de datos (SQLite)
│   ├── middlewares/    # Middlewares de Express
│   ├── modules/        # Módulos funcionales (sessions, reports)
│   ├── app.js          # Configuración de Express
│   └── server.js       # Punto de entrada del servidor
├── public/             # Archivos estáticos (Frontend)
├── data/               # Almacenamiento de la DB (ignorado en git)
└── package.json        # Definición del proyecto y scripts
```

## Notas

- La base de datos es un archivo SQLite ubicado en `data/pomodoro.db`.
- En plataformas de despliegue efímeras (como Heroku o instancias serverless), los datos se perderán al reiniciar si no se configura un volumen persistente.
