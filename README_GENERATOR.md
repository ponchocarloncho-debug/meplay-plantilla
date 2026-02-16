# 🎬 Generador de Páginas de Video

Este script genera automáticamente TODAS las páginas de video desde `videodata.json`.

## 📋 Archivos Necesarios

```
tu-proyecto/
├── videodata.json          # Base de datos de videos
├── generate_video_pages.py # Este generador
├── ads.txt                 # Tu script de ads (opcional)
├── index.html
├── favorites.html
├── widget.js
├── logo.png
├── favicon.ico
└── videos/                 # Carpeta donde se generarán las páginas
    ├── diego-yoga.html
    ├── vara-pool.html
    └── ... (todas las demás)
```

## 🚀 Cómo Usar

### 1. Primera Generación

```bash
python3 generate_video_pages.py
```

Esto creará TODAS las páginas (puede ser cientos o miles) en la carpeta `videos/`.

### 2. Actualizar Script de Ads

Si quieres actualizar el script de ads en TODAS las páginas:

1. **Edita `ads.txt`** y pega tu script de ads:
   ```html
   <script>
     // Tu código de AdSense, PropellerAds, etc.
   </script>
   ```

2. **Ejecuta el generador otra vez**:
   ```bash
   python3 generate_video_pages.py
   ```

3. **¡Listo!** Todas las páginas ahora tienen el nuevo script.

## ✨ Características de las Páginas Generadas

Cada página incluye:

- ✅ Navbar con logo, Home y Favorites
- ✅ Buscador funcional
- ✅ Espacio para ads script (actualizable desde ads.txt)
- ✅ Embed especial de video (Myvidster-friendly)
- ✅ Galería de imágenes (2 columnas, primeras 6 + botón "Show More")
- ✅ Tags clickeables que activan el buscador
- ✅ Sidebar con videos relacionados
- ✅ Meta tags para SEO y redes sociales
- ✅ Responsive design

## 🔧 Personalización

Para personalizar el diseño:

1. Edita el archivo `generate_video_pages.py`
2. Busca la sección de estilos CSS
3. Modifica colores, tamaños, etc.
4. Ejecuta el generador de nuevo

## 📝 Notas

- El script lee `videodata.json` y genera una página HTML por cada video
- Las URLs se toman del campo `"url"` en el JSON
- El embed se codifica en Base64 para protección
- Si no existe `ads.txt`, las páginas se generan sin scripts de ads (puedes agregarlo después)

## 🆘 Solución de Problemas

**Problema**: "File not found: videodata.json"
**Solución**: Asegúrate de que `videodata.json` está en la misma carpeta que el script

**Problema**: Las páginas no tienen ads
**Solución**: Crea el archivo `ads.txt` con tu script y ejecuta el generador de nuevo

**Problema**: Quiero cambiar el diseño de TODAS las páginas
**Solución**: Edita `generate_video_pages.py`, modifica el template, y ejecuta de nuevo
