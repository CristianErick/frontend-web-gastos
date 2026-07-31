# Frontend Web - Panel Administrativo

SPA administrativa desarrollada en Vue 3 + Tailwind CSS para gestionar el Sistema de Control de Gastos.

## Prerrequisitos

- Node.js >= 18
- NPM

## Instalación Local (Windows)

```powershell
npm install
```

Configurar variable de entorno en `.env.local`:
```
VITE_API_URL=http://localhost:8000/api
```

```powershell
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## Despliegue en Vercel

1. Conectar repositorio de GitHub con Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Variable de entorno: `VITE_API_URL=https://tu-api.digitalocean.com/api`
